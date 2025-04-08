package com.c109.chaintoon.domain.nft.controller;


import com.c109.chaintoon.domain.nft.dto.request.AuctionBidRequestDto;
import com.c109.chaintoon.domain.nft.dto.request.AuctionBuyNowRequestDto;
import com.c109.chaintoon.domain.nft.dto.request.AuctionCreateRequestDto;
import com.c109.chaintoon.domain.nft.dto.response.AuctionBidResponseDto;
import com.c109.chaintoon.domain.nft.dto.response.AuctionBuyNowResponseDto;
import com.c109.chaintoon.domain.nft.dto.response.AuctionCreateResponseDto;
import com.c109.chaintoon.domain.nft.dto.response.BiddingHistoryResponseDto;
import com.c109.chaintoon.domain.nft.service.AuctionItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auctions")
public class AuctionItemController {

    private final AuctionItemService auctionItemService;

    // 판매 등록
    @PostMapping
    public ResponseEntity<?> createAuctionItem(
            @AuthenticationPrincipal Integer userId,
            @RequestBody @Valid AuctionCreateRequestDto auctionCreateRequestDto
            ) {
        // 소유자 체크 통과 시 경매 등록 진행
        AuctionCreateResponseDto response = auctionItemService.createAuctionItem(userId, auctionCreateRequestDto);
        return ResponseEntity.ok(response);
    }

    // 에피소드 경매 목록 조회
    @GetMapping("/episodes")
    public ResponseEntity<?> getEpisodeAuctions(
            @RequestParam Integer webtoonId,
            @RequestParam(required = false, defaultValue = "N") String ended,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String orderBy
    ) {
        Page<AuctionCreateResponseDto> result = auctionItemService.getFilteredAuctionItems(webtoonId, "episode", ended, page, pageSize, orderBy);
        return ResponseEntity.ok(result);
    }

    // 굿즈 경매 목록 조회
    @GetMapping("/goods")
    public ResponseEntity<?> getGoodAuctions(
            @RequestParam(required = false) Integer webtoonId,
            @RequestParam(required = false, defaultValue = "N") String ended,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String orderBy
    ) {
        Page<AuctionCreateResponseDto> result = auctionItemService.getFilteredAuctionItems(webtoonId, "goods", ended, page, pageSize, orderBy);
        return ResponseEntity.ok(result);
    }

    // 팬아트 경매 목록 조회
    @GetMapping("/fanarts")
    public ResponseEntity<?> getFanartAuctions(
            @RequestParam(required = false) Integer webtoonId,
            @RequestParam(required = false, defaultValue = "N") String ended,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String orderBy
    ) {
        Page<AuctionCreateResponseDto> result = auctionItemService.getFilteredAuctionItems(webtoonId, "fanart", ended, page, pageSize, orderBy);
        return ResponseEntity.ok(result);
    }

    // 경매 입찰
    @PostMapping("/bid")
    public ResponseEntity<?> tenderBid (
            @AuthenticationPrincipal Integer userId,
            @RequestBody @Valid AuctionBidRequestDto auctionBidRequestDto
            ) {
        AuctionBidResponseDto response = auctionItemService.tenderBid(userId, auctionBidRequestDto);
        return ResponseEntity.ok(response);
    }

    // 입찰 목록
    @GetMapping("/{auctionItemId}/bidding-history")
    public ResponseEntity<?> getBiddingHistory(
            @PathVariable Integer auctionItemId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "biddingPrice") String orderBy
    ) {
        List<BiddingHistoryResponseDto> response = auctionItemService.getBiddingHistoryByAuctionItem(auctionItemId, page, pageSize, orderBy);
        return ResponseEntity.ok(response);
    }

    // 즉시 구매
    @PostMapping("buy-now")
    public ResponseEntity<?> buyNow (
            @AuthenticationPrincipal Integer userId,
            @RequestBody @Valid AuctionBuyNowRequestDto buyNowRequestDto
            ) {
        AuctionBuyNowResponseDto response = auctionItemService.buyNow(userId, buyNowRequestDto);
        return ResponseEntity.ok(response);
    }

    // 낙찰자 선정 - 비동기 ver
    @PostMapping("/{auctionItemId}/select-winner")
    public ResponseEntity<?> selectAuctionWinner(
            @PathVariable Integer auctionItemId
    ) {
        auctionItemService.selectAuctionWinner(auctionItemId);
        return ResponseEntity.ok("낙찰자 선정 작업이 실행되었습니다.");
    }
}
