package com.c109.chaintoon.domain.nft.service;

import com.c109.chaintoon.common.exception.UnauthorizedAccessException;
import com.c109.chaintoon.common.scheduler.service.SchedulingService;
import com.c109.chaintoon.domain.nft.dto.blockchain.request.BlockchainBuyRequestDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.request.BlockchainSaleRequestDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.WalletBalance;
import com.c109.chaintoon.domain.nft.dto.request.AuctionBidRequestDto;
import com.c109.chaintoon.domain.nft.dto.request.AuctionBuyNowRequestDto;
import com.c109.chaintoon.domain.nft.dto.request.AuctionCreateRequestDto;
import com.c109.chaintoon.domain.nft.dto.response.AuctionBidResponseDto;
import com.c109.chaintoon.domain.nft.dto.response.AuctionBuyNowResponseDto;
import com.c109.chaintoon.domain.nft.dto.response.AuctionCreateResponseDto;
import com.c109.chaintoon.domain.nft.dto.response.BiddingHistoryResponseDto;
import com.c109.chaintoon.domain.nft.entity.AuctionItem;
import com.c109.chaintoon.domain.nft.entity.BiddingHistory;
import com.c109.chaintoon.domain.nft.entity.Nft;
import com.c109.chaintoon.domain.nft.entity.TradingHistory;
import com.c109.chaintoon.domain.nft.exception.*;
import com.c109.chaintoon.domain.nft.repository.AuctionItemRepository;
import com.c109.chaintoon.domain.nft.repository.BiddingHistoryRepository;
import com.c109.chaintoon.domain.nft.repository.NftRepository;
import com.c109.chaintoon.domain.nft.repository.TradingHistoryRepository;
import com.c109.chaintoon.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuctionItemService {

    private final AuctionItemRepository auctionItemRepository;
    private final NftRepository nftRepository;
    private final BiddingHistoryRepository biddingHistoryRepository;
    private final TradingHistoryRepository tradingHistoryRepository;
    private final BlockchainService blockchainService;
    private final SchedulingService schedulingService;
    private final UserRepository userRepository;

    // 판매 등록
    public AuctionCreateResponseDto createAuctionItem(Integer userId, AuctionCreateRequestDto auctionCreateRequestDto) {
        log.debug("Received AuctionCreateRequestDto: {}", auctionCreateRequestDto);

        Nft nft = nftRepository.findById(auctionCreateRequestDto.getNftId())
                .orElseThrow(() -> new NftNotFoundException(auctionCreateRequestDto.getNftId()));

        // NFT 소유자와 인증된 userId 비교
        if (!nft.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("권한이 없습니다. NFT 소유자만 경매 등록이 가능합니다.");
        }

        // 엔티티 생성
        AuctionItem auctionItem = AuctionItem.builder()
                .nftId(auctionCreateRequestDto.getNftId())
                .biddingPrice(auctionCreateRequestDto.getMinimumBidPrice())
                .buyNowPrice(auctionCreateRequestDto.getBuyNowPrice())
                .endTime(auctionCreateRequestDto.getEndTime())
                .type(nft.getType())
                .build();

        // DB에 저장
        AuctionItem saved = auctionItemRepository.save(auctionItem);
        log.debug("AuctionItem saved: {}", saved);

        // 경매 종료 시각에 낙찰자 선정 작업 예약
        schedulingService.scheduleAuctionEnd(saved.getAuctionItemId(), saved.getEndTime(), this::selectAuctionWinner);

        // NFT 측에 판매 등록 요청
        BlockchainSaleRequestDto saleRequestDto = BlockchainSaleRequestDto.builder()
                .tokenId(nft.getTokenId())
                .price(saved.getBiddingPrice())
                .userId(nft.getUserId())
                .build();

        blockchainService.registerSale(saleRequestDto)
                .doOnSuccess(blockchainSaleResponseDto -> {
                    log.info("블록체인 판매 등록 요청 성공 - tokenId: {}, price: {}, userId: {}, tradeId: {}, status: {}",
                            saleRequestDto.getTokenId(), saleRequestDto.getPrice(), saleRequestDto.getUserId(), blockchainSaleResponseDto.getTradeId(), blockchainSaleResponseDto.getStatus());

                    saved.setBlockchainStatus("SUCCESS");
                    auctionItemRepository.save(saved);
                })
                .doOnError(e -> {
                    log.error("블록체인 판매 등록 요청 실패: {}", e.getMessage());
                    saved.setBlockchainStatus("FAILED");
                    auctionItemRepository.save(saved);
                })
                .subscribe();

        // TODO : 블록체인 상에서 판매 등록에 실패했을 경우 사용자에게 별도 알람 처리

        // 저장된 엔티티 정보를 response DTO로 변환
        AuctionCreateResponseDto response = AuctionCreateResponseDto.builder()
                .auctionItemId(saved.getAuctionItemId())
                .nftId(saved.getNftId())
                .type(saved.getType())
                .biddingPrice(saved.getBiddingPrice())
                .buyNowPrice(saved.getBuyNowPrice())
                .startTime(saved.getStartTime())
                .endTime(saved.getEndTime())
                .ended(saved.getEnded())
                .success(saved.getSuccess())
                .createdAt(saved.getCreatedAt())
                .blockchainStatus(saved.getBlockchainStatus())
                .build();

        return response;
    }

    // 경매 입찰
    @Transactional
    public AuctionBidResponseDto tenderBid(Integer userId, AuctionBidRequestDto bidRequestDto) {
        // 경매 아이템 조회
        AuctionItem auctionItem = auctionItemRepository.findById(bidRequestDto.getAuctionItemId())
                .orElseThrow(() -> new AuctionItemNotFoundException(bidRequestDto.getAuctionItemId()));

        // 판매 등록자 확인을 위한 nft 조회
        Nft nft = nftRepository.findById(auctionItem.getNftId())
                .orElseThrow(() -> new NftNotFoundException(auctionItem.getNftId()));

        // 자신이 등록한 nft인지 확인
        if (nft.getUserId().equals(userId)) {
            throw new InvalidBidPriceException("자신이 등록한 상품에는 입찰할 수 없습니다.");
        }

        // 경매 종료 여부 검증
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(auctionItem.getEndTime()) || "Y".equals(auctionItem.getEnded())) {
            throw new AuctionEndedException("이미 종료된 경매입니다.");
        }

        // 현재 최고 입찰가 검증
        Double currentBid = auctionItem.getBiddingPrice() == null ? 0.0 : auctionItem.getBiddingPrice();
        if (bidRequestDto.getBiddingPrice() <= currentBid) {
            throw new InvalidBidPriceException("제시한 입찰가가 현재 입찰가보다 높아야 합니다.");
        }

        // 입찰가가 즉시 구매가 이상인 경우
        Double buyNowPrice = auctionItem.getBuyNowPrice();
        if (buyNowPrice != null && bidRequestDto.getBiddingPrice() >= buyNowPrice) {
            throw new InvalidBidPriceException("즉시 구매를 이용해 주세요");
        }

        // 입찰 정보 업데이트(biddingPrice,  bidderId)
        auctionItem.setBiddingPrice(bidRequestDto.getBiddingPrice());

        AuctionItem savedItem = auctionItemRepository.save(auctionItem);

        // 거래내역 업데이트 : 동일 입찰자가 이미 입찰한 내역이 있는지 체크
        List<BiddingHistory> oldBids = biddingHistoryRepository.findByAuctionItemIdAndUserIdAndIsLatestTrue(savedItem.getAuctionItemId(), userId);

        for (BiddingHistory oldBid : oldBids) {
            oldBid.setIsLatest(false);
            biddingHistoryRepository.save(oldBid);
        }

        BiddingHistory newBid = BiddingHistory.builder()
                .auctionItemId(savedItem.getAuctionItemId())
                .userId(userId)
                .biddingPrice(bidRequestDto.getBiddingPrice())
                .bidTime(LocalDateTime.now())
                .isLatest(true)
                .build();
        biddingHistoryRepository.save(newBid);

        return AuctionBidResponseDto.builder()
                .auctionItemId(savedItem.getAuctionItemId())
                .bidderId(userId)
                .biddingPrice(savedItem.getBiddingPrice())
                .startTime(savedItem.getEndTime())
                .endTime(savedItem.getEndTime())
                .build();
    }

    // 입찰 목록 조회
    public List<BiddingHistoryResponseDto> getBiddingHistoryByAuctionItem(Integer auctionItemId, int page, int pageSize, String orderBy) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<BiddingHistory> biddingHistoryPage = biddingHistoryRepository.findByAuctionItemIdOrderByBiddingPriceDesc(auctionItemId, pageable);

        int startSeq = (page - 1) * pageSize + 1;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        List<BiddingHistoryResponseDto> dtoList = new ArrayList<>();
        for(int i=0; i<biddingHistoryPage.getContent().size(); i++){
            BiddingHistory bid = biddingHistoryPage.getContent().get(i);

            String nickname = userRepository.findById(bid.getUserId())
                    .map(user -> user.getNickname())
                    .orElse("Unknown");


            BiddingHistoryResponseDto dto = BiddingHistoryResponseDto.builder()
                    .sequence(startSeq + i)
                    .userId(bid.getUserId())
                    .biddingPrice(bid.getBiddingPrice())
                    .createdAt(bid.getBidTime().format(formatter))
                    .build();
            dtoList.add(dto);
        }
        return dtoList;
    }

    // 즉시 구매
    @Transactional
    public AuctionBuyNowResponseDto buyNow(Integer userId, AuctionBuyNowRequestDto buyNowRequestDto) {
        // 경매 아이템 조회
        AuctionItem auctionItem = auctionItemRepository.findById(buyNowRequestDto.getAuctionItemId())
                .orElseThrow(() -> new AuctionItemNotFoundException(buyNowRequestDto.getAuctionItemId()));

        // 경매 종료 여부 검증
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(auctionItem.getEndTime()) || "Y".equals(auctionItem.getEnded())) {
            throw new AuctionEndedException("이미 종료된 경매입니다.");
        }

        // 즉시 구매 조건 검증
        Double buyNowPrice = auctionItem.getBuyNowPrice();
        if (buyNowPrice == null) {
            throw new InvalidBuyNowPriceException("즉시 구매가가 설정되어 있지 않습니다.");
        }

        Nft nft = nftRepository.findById(auctionItem.getNftId())
                .orElseThrow(() -> new NftNotFoundException(auctionItem.getNftId()));

        // 자신이 등록한 nft인지 확인
        if (nft.getUserId().equals(userId)) {
            throw new InvalidBidPriceException("자신이 등록한 상품은 즉시 구매할 수 없습니다.");
        }

        // 구매자 지갑 잔액 확인
        WalletBalance walletBalance = blockchainService.getWalletBalance(userId);
        log.info("구매자 {}의 잔액: {}", userId, walletBalance.getAmount());

        // 구매자 잔액이 즉시 구매 가격보다 부족하면 구매 불가 처리
        if (walletBalance.getAmount() < buyNowPrice) {
            throw new InsufficientWalletBalanceException("구매자 지갑 잔액이 부족합니다.");
        }

        // 블록체인에 구매 요청 보내기
        BlockchainBuyRequestDto buyRequestDto = BlockchainBuyRequestDto.builder()
                .tokenId(nft.getTokenId())
                        .price(buyNowPrice)
                                .userId(userId)
                                        .build();

        blockchainService.registerBuy(buyRequestDto);

        // 경매 아이템 업데이트
        auctionItem.setBiddingPrice(buyNowPrice);
        auctionItem.setEnded("Y");
        auctionItem.setSuccess("Y");
        auctionItem.setEndTime(now);

        AuctionItem savedItem = auctionItemRepository.save(auctionItem);

        // 거래 내역 업데이트
        TradingHistory tradingHistory = TradingHistory.builder()
                .auctionItemId(savedItem.getAuctionItemId())
                .nftId(savedItem.getNftId())
                .buyerId(userId)
                .sellerId(nft.getUserId())
                .tradingValue(buyNowPrice)
                .build();

        tradingHistoryRepository.save(tradingHistory);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // 비동기적으로 구매 후 지갑 잔액 조회해서 로그 출력
        blockchainService.getWalletBalanceAsync(userId)
                .subscribe(remainingBalance -> {
                    log.info("구매 후 남은 잔액: {}", remainingBalance.getAmount());
                }, error -> {
                    log.error("구매 후 잔액 조회 실해: {}", error.getMessage());
                });

        // 반환
        AuctionBuyNowResponseDto response = AuctionBuyNowResponseDto.builder()
                .auctionItemId(savedItem.getAuctionItemId())
                .buyNowPrice(buyNowPrice)
                .buyerId(userId)
                .startTime(savedItem.getStartTime() != null ? savedItem.getStartTime().format(formatter) : null)
                .endTime(savedItem.getEndTime().format(formatter))
                .build();

        return response;
    }

    // 낙찰자 선정 메서드 - 비동기ver
    public void selectAuctionWinner(Integer auctionItemId) {
        AuctionItem auctionItem = auctionItemRepository.findById(auctionItemId)
                .orElseThrow(() -> new AuctionItemNotFoundException(auctionItemId));

        Nft nft = nftRepository.findById(auctionItem.getNftId())
                .orElseThrow(() -> new NftNotFoundException(auctionItem.getNftId()));

        // 경매 아이템의 입찰 내역을 입찰가 내림차순으로 가져오기
        List<BiddingHistory> latestBids = biddingHistoryRepository
                .findAllByAuctionItemIdAndIsLatestTrueOrderByBiddingPriceDesc(auctionItemId);

        log.debug("BiddingHistory count for auctionItemId {}: {}", auctionItemId, latestBids.size());

        for (BiddingHistory history : latestBids) {
            System.out.println("입찰가 : " + history.getBiddingPrice());
        }

        // 입찰 내역이 없을 경우
        if (latestBids.isEmpty()) {
            auctionItem.setEnded("Y");
            auctionItem.setSuccess("N");
            auctionItemRepository.save(auctionItem);
            log.info("입찰 내역이 없어 경매 종료 처리: auctionItemId={}", auctionItemId);
            return;
        }

        // 입찰자 ID를 키로, 입찰가를 값으로 하는 Map 생성
        Map<Integer, Double> bidderBidMap = latestBids.stream()
                .collect(Collectors.toMap(
                        BiddingHistory::getUserId,
                        BiddingHistory::getBiddingPrice
                ));

        // 각 입찰자에 대해 비동기로 지갑 잔액 조회 요청
        Map<Integer, WalletBalance> bidderBalances = new ConcurrentHashMap<>();

        // 비동기적으로 여러 입찰자의 지갑 잔액을 조회하고, 조회 결과를 맵에 저장
        List<CompletableFuture<Void>> futures = new ArrayList<>(); // 비동기 작업을 관리하기 위한 리스트

        // bidderBidMap을 순회하며 입찰자 id 가져오기
        for(Map.Entry<Integer, Double> entry : bidderBidMap.entrySet()) {
            Integer bidderId = entry.getKey();

            // 비동기 작업 시작
            CompletableFuture<Void> future = CompletableFuture.supplyAsync(() -> {
                return blockchainService.getWalletBalance(bidderId);
            }).thenAccept(balance -> { // 잔액 조회 결과를 MAP에 저장
                bidderBalances.put(bidderId, balance);
                log.info("bidder {}의 잔액 : {}", bidderId, balance.getAmount());
            }).exceptionally(e -> { // 비동기 작업 중 예외가 발생하면 처리
                log.error("bidder {}의 지갑 잔액 조회 실패 : {}", bidderId, e.getMessage());
                return null;
            });
            futures.add(future); // 비동기 작업 리스트에 추가
        }

        // 모든 비동기 요청이 완료되면 낙찰자 선정 로직 실행
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join(); // 모든 입찰자의 지갑 조회가 완료될때까지 기다림

        // 내림차순으로 bidder 목록 정렬
        List<Integer> sortedBidders = bidderBidMap.entrySet().stream()
                .sorted(Comparator.comparingDouble(Map.Entry<Integer,Double>::getValue).reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        Integer winner = null;
        for (Integer bidderId : sortedBidders) {
            double bidPrice = bidderBidMap.get(bidderId);
            WalletBalance balance = bidderBalances.get(bidderId);
            if (balance == null) {
                log.warn("bidder {}의 잔액 정보를 가져오지 못했습니다.", bidderId);
                continue;
            }
            // 잔액이 입찰가 이상이면 유효한 입찰로 간주
            if (balance.getAmount() >= bidPrice) {
                winner = bidderId;
                log.info("낙찰자 선정 : bidder {} (입찰가: {}, 잔액: {})", bidderId, bidPrice, balance.getAmount());
                break;
            }
        }

        if (winner == null) {
            log.info("모든 bidder가 잔액 부족으로 낙찰 조건을 충족하지 못했습니다.");
        } else {
            // 낙찰자가 선정되면 경매 아이템 상태 업데이트, 거래 내역 기록 등의 후속 작업 진행
            auctionItem.setEnded("Y");
            auctionItem.setSuccess("Y");

            auctionItemRepository.save(auctionItem);

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
            LocalDateTime now = LocalDateTime.now();

            TradingHistory tradingHistory = TradingHistory.builder()
                    .auctionItemId(auctionItem.getAuctionItemId())
                    .nftId(auctionItem.getNftId())
                    .buyerId(winner)
                    .sellerId(nft.getUserId())
                    .tradingValue(bidderBidMap.get(winner))
                    .tradingDate(now.format(dateFormatter))
                    .tradingTime(now.format(timeFormatter))
                    .build();
            tradingHistoryRepository.save(tradingHistory);

            // NFT의 소유자 변경: 낙찰자를 새로운 소유주로 업데이트
            nft.setUserId(winner);
            nftRepository.save(nft);

            BlockchainBuyRequestDto buyRequestDto = BlockchainBuyRequestDto.builder()
                    .tokenId(nft.getTokenId())
                    .price(bidderBidMap.get(winner))
                    .userId(winner)
                    .build();
            blockchainService.registerBuy(buyRequestDto);
            log.info("블록체인 구매 등록 요청 보내짐 for 낙찰자: {}", winner);
        }
    }

    // 낙찰자 선정 메서드 - 동기 ver
    public void selectAuctionWinnerSynchronous(Integer auctionItemId) {
        List<BiddingHistory> biddingHistories = biddingHistoryRepository.findByAuctionItemIdOrderByBiddingPriceDesc(auctionItemId);

        Map<Integer, Double> bidderBidMap = biddingHistories.stream()
                .collect(Collectors.toMap(
                        BiddingHistory::getUserId,
                        BiddingHistory::getBiddingPrice
                ));

        List<Integer> sortedBidders = bidderBidMap.entrySet().stream()
                .sorted(Comparator.comparingDouble(Map.Entry<Integer, Double>::getValue).reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        Integer winner = null;
        for (Integer bidderId : sortedBidders) {
            try {
                WalletBalance balance = blockchainService.getWalletBalance(bidderId);
                log.info("bidder {}의 잔액: {]", bidderId, balance.getAmount());

                // 잔액이 입찰가 이상인 경우 낙찰자로 선정
                if (balance.getAmount() >= bidderBidMap.get(bidderId)) {
                    winner = bidderId;
                    log.info("낙찰자 선정: bidder {} (입찰가: {}, 잔액: {})", bidderId, bidderBidMap.get(bidderId), balance.getAmount());
                    break;
                }
            } catch (Exception e) {
                log.error("bidder {}의 지갑 조회 실패: {}", bidderId, e.getMessage());
            }
        }

        if(winner == null) {
            log.info("모든 입찰자가 잔액 부족으로 낙찰 조건을 충족하지 못했습니다.");
        } else {
            // 낙찰자가 결정되면 블록체인에 구매 요청
            Nft nft = nftRepository.findById(auctionItemId)
                    .orElseThrow(() -> new NftNotFoundException(auctionItemId));

            BlockchainBuyRequestDto buyNowRequestDto = new BlockchainBuyRequestDto().builder()
                    .tokenId(nft.getTokenId())
                    .price(bidderBidMap.get(winner))
                    .userId(winner)
                    .build();

            blockchainService.registerBuy(buyNowRequestDto);
            log.info("블록체인 구매 등록 요청 보내짐 for 낙찰자: {}", winner);
        }
    }

    // 에피소드, 굿즈, 팬아트별 목록 조회
    public Page<AuctionCreateResponseDto> getFilteredAuctionItems(String type, String ended, int page, int pageSize, String orderBy) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<AuctionItem> pageResult;

        if(StringUtils.hasText(ended)) {
            pageResult = auctionItemRepository.findByTypeAndEnded(type, ended, pageable);
        } else {
            pageResult = auctionItemRepository.findByType(type, pageable);
        }

        Page<AuctionCreateResponseDto> dtoPage = pageResult.map(item -> AuctionCreateResponseDto.builder()
                .auctionItemId(item.getAuctionItemId())
                .nftId(item.getNftId())
                .biddingPrice(item.getBiddingPrice())
                .buyNowPrice(item.getBuyNowPrice())
                .startTime(item.getStartTime() != null ?item.getStartTime() : null)
                .endTime(item.getEndTime() != null ? item.getEndTime() : null)
                .ended(item.getEnded())
                .type(item.getType())
                .build()
        );
        return dtoPage;
    }

    private Sort getSort(String orderBy) {
        if("biddingPrice".equalsIgnoreCase(orderBy)) {
            return Sort.by(Sort.Direction.DESC, "biddingPrice");
        } else if ("createdAt".equalsIgnoreCase(orderBy)) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        } else {
            return Sort.by(Sort.Direction.DESC, "biddingPrice");
        }
    }
}
