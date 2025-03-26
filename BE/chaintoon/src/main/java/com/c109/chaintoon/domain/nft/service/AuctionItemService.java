package com.c109.chaintoon.domain.nft.service;

import com.c109.chaintoon.domain.nft.dto.request.AuctionBidRequestDto;
import com.c109.chaintoon.domain.nft.dto.request.AuctionBuyNowRequestDto;
import com.c109.chaintoon.domain.nft.dto.request.AuctionCreateRequestDto;
import com.c109.chaintoon.domain.nft.dto.response.AuctionBidResponseDto;
import com.c109.chaintoon.domain.nft.dto.response.AuctionBuyNowResponseDto;
import com.c109.chaintoon.domain.nft.dto.response.AuctionCreateResponseDto;
import com.c109.chaintoon.domain.nft.entity.AuctionItem;
import com.c109.chaintoon.domain.nft.entity.BiddingHistory;
import com.c109.chaintoon.domain.nft.entity.Nft;
import com.c109.chaintoon.domain.nft.entity.TradingHistory;
import com.c109.chaintoon.domain.nft.exception.*;
import com.c109.chaintoon.domain.nft.repository.AuctionItemRepository;
import com.c109.chaintoon.domain.nft.repository.BiddingHistoryRepository;
import com.c109.chaintoon.domain.nft.repository.NftRepository;
import com.c109.chaintoon.domain.nft.repository.TradingHistoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuctionItemService {

    private final AuctionItemRepository auctionItemRepository;
    private final NftRepository nftRepository;
    private final BiddingHistoryRepository biddingHistoryRepository;
    private final TradingHistoryRepository tradingHistoryRepository;

    // 판매 등록
    public AuctionCreateResponseDto createAuctionItem(AuctionCreateRequestDto auctionCreateRequestDto) {
        log.debug("Received AuctionCreateRequestDto: {}", auctionCreateRequestDto);

        // 엔티티 생성
        AuctionItem auctionItem = AuctionItem.builder()
                .nftId(auctionCreateRequestDto.getNftId())
                .biddingPrice(auctionCreateRequestDto.getMinimumBidPrice())
                .buyNowPrice(auctionCreateRequestDto.getBuyNowPrice())
                .endTime(auctionCreateRequestDto.getEndTime())
                .build();

        log.debug("AuctionItem before save: {}", auctionItem);
        // DB에 저장
        AuctionItem saved = auctionItemRepository.save(auctionItem);
        log.debug("AuctionItem saved: {}", saved);

        // 저장된 엔티티 정보를 response DTO로 변환
        AuctionCreateResponseDto response = AuctionCreateResponseDto.builder()
                .auctionItemId(saved.getAuctionItemId())
                .nftId(saved.getNftId())
                .biddingPrice(saved.getBiddingPrice())
                .buyNowPrice(saved.getBuyNowPrice())
                .startTime(saved.getStartTime())
                .endTime(saved.getEndTime())
                .ended(saved.getEnded())
                .success(saved.getSuccess())
                .createdAt(saved.getCreatedAt())
                .build();

        return response;
    }

    // 경매 입찰
    @Transactional
    public AuctionBidResponseDto tenderBid(AuctionBidRequestDto bidRequestDto) {
        // 경매 아이템 조회
        AuctionItem auctionItem = auctionItemRepository.findById(bidRequestDto.getAuctionItemId())
                .orElseThrow(() -> new AuctionItemNotFoundException(bidRequestDto.getAuctionItemId()));

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
        auctionItem.setBidderId(bidRequestDto.getBidderId());

        AuctionItem savedItem = auctionItemRepository.save(auctionItem);

        Nft nft = nftRepository.findById(savedItem.getNftId())
                .orElseThrow(() -> new NftNotFoundException(savedItem.getNftId()));

        // 거래내역 업데이트 : 동일 입찰자가 이미 입찰한 내역이 있는지 체크
        Optional<BiddingHistory> optionalBiddingHistory = biddingHistoryRepository.findByAuctionItemIdAndUserId(savedItem.getAuctionItemId(), bidRequestDto.getBidderId());
        BiddingHistory biddingHistory;

        if(optionalBiddingHistory.isPresent()) {
            // 기존 기록이 있으면 입찰가와 입찰 시간을 갱신
            biddingHistory = optionalBiddingHistory.get();
            biddingHistory.setBiddingPrice(bidRequestDto.getBiddingPrice());
            biddingHistory.setBidTime(LocalDateTime.now());
        } else {
            // 기록이 없으면 새로 생성
            biddingHistory = BiddingHistory.builder()
                    .auctionItemId(savedItem.getAuctionItemId())
                    .userId(bidRequestDto.getBidderId())
                    .biddingPrice(bidRequestDto.getBiddingPrice())
                    .bidTime(LocalDateTime.now())
                    .build();
        }
        biddingHistoryRepository.save(biddingHistory);

        // 결과 반환
        AuctionBidResponseDto response = AuctionBidResponseDto.builder()
                .auctionItemId(savedItem.getAuctionItemId())
                .biddingPrice(savedItem.getBiddingPrice())
                .bidderId(savedItem.getBidderId())
                .startTime(savedItem.getStartTime())
                .endTime(savedItem.getEndTime())
                .build();

        return response;
    }

    // 즉시 구매
    @Transactional
    public AuctionBuyNowResponseDto buyNow(AuctionBuyNowRequestDto buyNowRequestDto) {
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

        // TODO : 구매자 지갑 잔액 확인


        // 경매 아이템 업데이트
        auctionItem.setBiddingPrice(buyNowPrice);
        auctionItem.setBidderId(buyNowRequestDto.getBidderId());
        auctionItem.setEnded("Y");
        auctionItem.setSuccess("Y");
        auctionItem.setEndTime(now);

        AuctionItem savedItem = auctionItemRepository.save(auctionItem);

        // 거래 내역 업데이트
        TradingHistory tradingHistory = TradingHistory.builder()
                .auctionItemId(savedItem.getAuctionItemId())
                .nftId(savedItem.getNftId())
                .buyerId(buyNowRequestDto.getBidderId())
                .sellerId(nft.getUserId())
                .tradingValue(buyNowPrice)
                .build();

        tradingHistoryRepository.save(tradingHistory);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // 반환
        AuctionBuyNowResponseDto response = AuctionBuyNowResponseDto.builder()
                .auctionItemId(savedItem.getAuctionItemId())
                .buyNowPrice(buyNowPrice)
                .buyerId(savedItem.getBidderId())
                .endTime(savedItem.getEndTime().format(formatter))
                .build();

        return response;
    }
}
