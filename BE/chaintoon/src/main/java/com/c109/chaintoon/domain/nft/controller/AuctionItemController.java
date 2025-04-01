package com.c109.chaintoon.domain.nft.controller;

import com.c109.chaintoon.domain.nft.dto.request.AuctionBidRequestDto;
import com.c109.chaintoon.domain.nft.dto.request.AuctionBuyNowRequestDto;
import com.c109.chaintoon.domain.nft.dto.request.AuctionCreateRequestDto;
import com.c109.chaintoon.domain.nft.dto.response.AuctionBidResponseDto;
import com.c109.chaintoon.domain.nft.dto.response.AuctionBuyNowResponseDto;
import com.c109.chaintoon.domain.nft.dto.response.AuctionCreateResponseDto;
import com.c109.chaintoon.domain.nft.dto.response.BiddingHistoryResponseDto;
import com.c109.chaintoon.domain.nft.entity.BiddingHistory;
import com.c109.chaintoon.domain.nft.entity.Nft;
import com.c109.chaintoon.domain.nft.exception.AuctionItemNotFoundException;
import com.c109.chaintoon.domain.nft.exception.NftNotFoundException;
import com.c109.chaintoon.domain.nft.repository.NftRepository;
import com.c109.chaintoon.domain.nft.service.AuctionItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auctions")
public class AuctionItemController {

    private final AuctionItemService auctionItemService;
    private final NftRepository nftRepository;

    // 판매 등록
    @PostMapping
    public ResponseEntity<?> createAuctionItem(
            @AuthenticationPrincipal Integer userId,
            @RequestBody AuctionCreateRequestDto auctionCreateRequestDto
            ) {

        // nft id로 nft 엔티티 조회
        Nft nft = nftRepository.findById(auctionCreateRequestDto.getNftId())
                .orElseThrow(() -> new NftNotFoundException(auctionCreateRequestDto.getNftId()));

        // nft 소유자와 인증된 userId 비교
        if (!nft.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 소유자 체크 통과 시 경매 등록 진행
        AuctionCreateResponseDto response = auctionItemService.createAuctionItem(auctionCreateRequestDto);
        return ResponseEntity.ok(response);
    }

    // 경매 입찰
    @PostMapping("/bid")
    public ResponseEntity<?> tenderBid (
            @AuthenticationPrincipal Integer userId,
            @RequestBody AuctionBidRequestDto auctionBidRequestDto
            ) {

        if (!auctionBidRequestDto.getBidderId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        AuctionBidResponseDto response = auctionItemService.tenderBid(auctionBidRequestDto);
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
            @RequestBody AuctionBuyNowRequestDto buyNowRequestDto
            ) {
        if(!buyNowRequestDto.getBidderId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        AuctionBuyNowResponseDto response = auctionItemService.buyNow(buyNowRequestDto);
        return ResponseEntity.ok(response);
    }

    // 낙찰자 선정 - 비동기 ver
    @PostMapping("/{auctionItemId}/select-winner")
    public ResponseEntity<?> selectAuctionWinner(
            @PathVariable Integer auctionItemId
    ) {
        try {
            auctionItemService.selectAuctionWinner(auctionItemId);
            return ResponseEntity.ok("낙찰자 선정 작업이 실행되었습니다.");
        } catch (AuctionItemNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("낙찰자 선정 중 오류 발생: " + e.getMessage());
        }
    }
}
