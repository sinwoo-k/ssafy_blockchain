package com.c109.chaintoon.domain.user.controller;

import com.c109.chaintoon.domain.nft.service.AuctionItemService;
import com.c109.chaintoon.domain.user.dto.response.ActiveTradingResponseDto;
import com.c109.chaintoon.domain.user.dto.response.TradingHistoryResponseDto;
import com.c109.chaintoon.domain.user.service.TradingHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trade-history")
@RequiredArgsConstructor
public class TradingHistoryController {

    private final TradingHistoryService tradingHistoryService;

    @GetMapping("/sold")
    public ResponseEntity<?> getSoldHistory(
            @AuthenticationPrincipal Integer userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "tradingDate") String orderBy
    ) {
        Page<TradingHistoryResponseDto> result = tradingHistoryService.getSoldHistory(userId, page, pageSize, orderBy);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bought")
    public ResponseEntity<?> getBoughtHistory(
            @AuthenticationPrincipal Integer userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "tradingDate") String orderBy
    ) {
        Page<TradingHistoryResponseDto> result = tradingHistoryService.getBoughtHistory(userId, page, pageSize, orderBy);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveTradingHistory(
            @AuthenticationPrincipal Integer userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String orderBy
    ) {
        Page<ActiveTradingResponseDto> result = tradingHistoryService.getActiveBiddingHistory(userId, page, pageSize, orderBy);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/active-sale")
    public ResponseEntity<?> getActiveSaleHistory(
            @AuthenticationPrincipal Integer userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String orderBy
    ) {
        Page<ActiveTradingResponseDto> result = tradingHistoryService.getActiveSaleItems(userId, page, pageSize, orderBy);
        return ResponseEntity.ok(result);
    }
}
