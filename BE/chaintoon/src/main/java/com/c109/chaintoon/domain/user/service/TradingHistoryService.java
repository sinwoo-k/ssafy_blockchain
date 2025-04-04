package com.c109.chaintoon.domain.user.service;

import com.c109.chaintoon.domain.nft.entity.AuctionItem;
import com.c109.chaintoon.domain.nft.entity.TradingHistory;
import com.c109.chaintoon.domain.nft.exception.NftNotFoundException;
import com.c109.chaintoon.domain.nft.repository.AuctionItemRepository;
import com.c109.chaintoon.domain.nft.repository.NftRepository;
import com.c109.chaintoon.domain.nft.repository.TradingHistoryRepository;
import com.c109.chaintoon.domain.user.dto.response.ActiveTradingResponseDto;
import com.c109.chaintoon.domain.user.dto.response.TradingHistoryResponseDto;
import com.c109.chaintoon.domain.webtoon.repository.WebtoonRepository;
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

    // 사용자 거래 내역 조회
    public Page<TradingHistoryResponseDto> getTradingHistory(Integer userId, String tradeType, int page, int pageSize, String orderBy) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<TradingHistory> historyPage;

        if ("sold".equalsIgnoreCase(tradeType)) {
            historyPage = tradingHistoryRepository.findBySellerId(userId, pageable);
        } else if ("bought".equalsIgnoreCase(tradeType)) {
            historyPage = tradingHistoryRepository.findByBuyerId(userId, pageable);
        } else {
            historyPage = Page.empty(pageable);
        }

        return historyPage.map(history -> {
            Nft nft = nftRepository.findById(history.getNftId())
                    .orElseThrow(() -> new NftNotFoundException(history.getNftId()));
            String webtoonName = null;
            if (nft.getWebtoonId() != null) {
                webtoonName = webtoonRepository.findById(nft.getWebtoonId())
                        .map(webtoon -> webtoon.getWebtoonName())
                        .orElse(null);
            }

            return TradingHistoryResponseDto.builder()
                    .auctionItemId(history.getAuctionItemId())
                    .nftId(history.getNftId())
                    .tradingValue(history.getTradingValue())
                    .tradingDate(history.getTradingDate())
                    .tradingTime(history.getTradingTime())
                    .tradeType(tradeType.toLowerCase())
                    // 판매 내역이면 상대방은 구매자, 구매 내역이면 상대방은 판매자
                    .otherParty("sold".equalsIgnoreCase(tradeType)
                            ? String.valueOf(history.getBuyerId())
                            : String.valueOf(history.getSellerId()))
                    .webtoonName(webtoonName)
                    .build();
        });
    }

    // 현재 거래중(판매중, 입찰중)인 목록 조회
    public Page<ActiveTradingResponseDto> getActiveTrades(Integer userId, int page, int pageSize, String orderBy) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));
        Page<AuctionItem> activePage = auctionItemRepository.findActiveTradesByBidder("N", userId, pageable);

        Page<ActiveTradingResponseDto> dtoPage = activePage.map(item -> {
            Nft nft = nftRepository.findById(item.getNftId())
                    .orElseThrow(() -> new NftNotFoundException(item.getNftId()));

            String webtoonName = null;
            if (nft.getWebtoonId() != null) {
                webtoonName = webtoonRepository.findById(nft.getWebtoonId())
                        .map(webtoon -> webtoon.getWebtoonName())
                        .orElse(null);
            }

            return ActiveTradingResponseDto.builder()
                    .auctionItemId(item.getAuctionItemId())
                    .nftId(item.getNftId())
                    .currentBiddingPrice(item.getBiddingPrice())
                    .buyNowPrice(item.getBuyNowPrice())
                    .startTime(item.getStartTime() != null ? item.getStartTime().toString() : null)
                    .endTime(item.getEndTime() != null ? item.getEndTime().toString() : null)
                    .webtoonName(webtoonName)
                    .build();
        });
        return dtoPage;
    }



private Sort getSort(String orderBy) {
    if ("tradingValue".equalsIgnoreCase(orderBy)) {
        return Sort.by(Sort.Direction.DESC, "tradingValue");
    } else if ("createdAt".equalsIgnoreCase(orderBy)) {
        return Sort.by(Sort.Direction.DESC, "createdAt");
    } else {
        // 기본 정렬 기준: tradingDate 내림차순
        return Sort.by(Sort.Direction.DESC, "tradingDate");
    }
}
}
