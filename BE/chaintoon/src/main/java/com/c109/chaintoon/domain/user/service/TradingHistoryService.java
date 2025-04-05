package com.c109.chaintoon.domain.user.service;

import com.c109.chaintoon.domain.nft.entity.AuctionItem;
import com.c109.chaintoon.domain.nft.entity.BiddingHistory;
import com.c109.chaintoon.domain.nft.entity.TradingHistory;
import com.c109.chaintoon.domain.nft.exception.NftNotFoundException;
import com.c109.chaintoon.domain.nft.repository.AuctionItemRepository;
import com.c109.chaintoon.domain.nft.repository.NftRepository;
import com.c109.chaintoon.domain.nft.repository.TradingHistoryRepository;
import com.c109.chaintoon.domain.user.dto.response.ActiveTradingResponseDto;
import com.c109.chaintoon.domain.user.dto.response.TradingHistoryResponseDto;
import com.c109.chaintoon.domain.webtoon.exception.WebtoonNotFoundException;
import com.c109.chaintoon.domain.webtoon.repository.WebtoonRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.c109.chaintoon.domain.nft.entity.Nft;

import java.time.format.DateTimeFormatter;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TradingHistoryService {

    private final TradingHistoryRepository tradingHistoryRepository;
    private final AuctionItemRepository auctionItemRepository;

    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
    private final NftRepository nftRepository;
    private final WebtoonRepository webtoonRepository;

    private TradingHistoryResponseDto convertToDto(TradingHistory history, String tradeType) {
        Nft nft = nftRepository.findById(history.getNftId())
                .orElseThrow(() -> new NftNotFoundException(history.getNftId()));

        String webtoonName = null;
        if (nft.getWebtoonId() != null) {
            webtoonName = webtoonRepository.findById(nft.getWebtoonId())
                    .map(webtoon -> webtoon.getWebtoonName())
                    .orElseThrow(() -> new WebtoonNotFoundException(history.getNftId()));
        } else {
            throw new WebtoonNotFoundException(history.getNftId());
        }

        String itemImage = nft.getImageUrl();

        String otherParty;
        if ("sold".equalsIgnoreCase(tradeType)) {
            otherParty = String.valueOf(history.getBuyerId());
        } else if ("bought".equalsIgnoreCase(tradeType)) {
            otherParty = String.valueOf(history.getSellerId());
        } else {
            otherParty = "";
        }

        return TradingHistoryResponseDto.builder()
                .auctionItemId(history.getAuctionItemId())
                .nftId(history.getNftId())
                .tradingValue(history.getTradingValue())
                .tradingDate(history.getTradingDate())
                .tradingTime(history.getTradingTime())
                .tradeType(tradeType.toLowerCase())
                .otherParty(otherParty)
                .webtoonName(webtoonName)
                .itemImage(itemImage)
                .build();
    }

    private ActiveTradingResponseDto convertToActiveTradingResponseDto(AuctionItem item) {
        Nft nft = nftRepository.findById(item.getNftId())
                .orElseThrow(() -> new NftNotFoundException(item.getNftId()));

        String webtoonName = null;
        if (nft.getWebtoonId() != null) {
            webtoonName = webtoonRepository.findById(nft.getWebtoonId())
                    .map(webtoon -> webtoon.getWebtoonName())
                    .orElseThrow(() -> new WebtoonNotFoundException(item.getNftId()));
        } else {
            throw new WebtoonNotFoundException(item.getNftId());
        }

        String itemImage = nft.getImageUrl();

        return ActiveTradingResponseDto.builder()
                .auctionItemId(item.getAuctionItemId())
                .nftId(item.getNftId())
                .itemImage(itemImage)
                .currentBiddingPrice(item.getBiddingPrice())
                .buyNowPrice(item.getBuyNowPrice())
                .startTime(item.getStartTime() != null ? item.getStartTime().toString() : null)
                .endTime(item.getEndTime() != null ? item.getEndTime().toString() : null)
                .webtoonName(webtoonName)
                .build();
    }

    private Sort getSort(String orderBy) {
        if ("tradingValue".equalsIgnoreCase(orderBy)) {
            return Sort.by(Sort.Direction.DESC, "tradingValue");
        } else if ("createdAt".equalsIgnoreCase(orderBy)) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        } else if ("tradingDate".equalsIgnoreCase(orderBy)) {
            return Sort.by(
                    Sort.Order.desc("tradingDate"),
                    Sort.Order.desc("tradingTime")
            );
        } else {
            // 기본 정렬 기준: tradingDate 내림차순
            return Sort.by(Sort.Direction.DESC, "tradingDate", "tradingTime");
        }
    }

    // 내가 판매한 내역 조회
    @Transactional
    public Page<TradingHistoryResponseDto> getSoldHistory(Integer userId, int page, int pageSize, String orderBy) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<TradingHistory> historyPage = tradingHistoryRepository.findBySellerId(userId, pageable);

        return historyPage.map(history -> convertToDto(history, "sold"));
    }

    // 내가 구매한 내역 조회
    @Transactional
    public Page<TradingHistoryResponseDto> getBoughtHistory(Integer userId, int page, int pageSize, String orderBy) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<TradingHistory> historyPage = tradingHistoryRepository.findByBuyerId(userId, pageable);

        return historyPage.map(history -> convertToDto(history, "bought"));
    }

    // 내가 입찰중인 내역
    @Transactional
    public Page<ActiveTradingResponseDto> getActiveBiddingHistory(Integer userId, int page, int pageSize, String orderBy) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<AuctionItem> activePage = auctionItemRepository.findActiveTradesByBidder(userId, pageable);

        return activePage.map(this::convertToActiveTradingResponseDto);
    }

    // 내가 판매중인 내역
    @Transactional
    public Page<ActiveTradingResponseDto> getActiveSaleItems(Integer userId, int page, int pageSize, String orderBy) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<AuctionItem> activePage = auctionItemRepository.findActiveSaleItems(userId, pageable);

        return activePage.map(this::convertToActiveTradingResponseDto);
    }
}
