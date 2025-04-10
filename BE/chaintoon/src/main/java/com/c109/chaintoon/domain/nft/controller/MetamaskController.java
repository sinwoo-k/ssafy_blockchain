package com.c109.chaintoon.domain.nft.controller;

import com.c109.chaintoon.domain.nft.dto.blockchain.request.NftMintRequestDto;
import com.c109.chaintoon.domain.nft.dto.metamask.request.MetamaskBuyRequestDto;
import com.c109.chaintoon.domain.nft.dto.metamask.request.MetamaskSellRequestDto;
import com.c109.chaintoon.domain.nft.dto.metamask.request.MetamaskSignatureRequestDto;
import com.c109.chaintoon.domain.nft.dto.metamask.response.MetamaskRequestResponseDto;
import com.c109.chaintoon.domain.nft.dto.metamask.response.MetamaskSignatureResponseDto;
import com.c109.chaintoon.domain.nft.service.MetamaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/blockchain/metamask")
public class MetamaskController {

    private final MetamaskService metamaskService;

    /**
     * 메타마스크 민팅 요청
     *  - 1단계: nonce 발급 + Redis 저장
     */
    @PostMapping("/mint-request")
    public Mono<ResponseEntity<MetamaskRequestResponseDto>> mintRequest(
            @AuthenticationPrincipal Integer userId,
            @RequestBody NftMintRequestDto dto
    ) {
        // 필요하다면 dto.setUserId(userId) 세팅
        return metamaskService.mintRequest(dto, userId)
                .map(ResponseEntity::ok);
    }

    /**
     * 메타마스크 판매 요청
     *  - 1단계: nonce 발급 + Redis 저장
     */
    @PostMapping("/sell-request")
    public Mono<ResponseEntity<MetamaskRequestResponseDto>> sellRequest(
            @AuthenticationPrincipal Integer userId,
            @RequestBody MetamaskSellRequestDto dto
    ) {
        dto.setUserId(userId);
        return metamaskService.sellRequest(dto)
                .map(ResponseEntity::ok);
    }

    /**
     * 메타마스크 구매 요청
     *  - 1단계: nonce 발급 + Redis 저장
     */
    @PostMapping("/buy-request")
    public Mono<ResponseEntity<MetamaskRequestResponseDto>> buyRequest(
            @AuthenticationPrincipal Integer userId,
            @RequestBody MetamaskBuyRequestDto dto
    ) {
         dto.setUserId(userId);
        return metamaskService.buyRequest(dto)
                .map(ResponseEntity::ok);
    }

    /**
     * (2단계) 서명 확인 + 트랜잭션 영수증 반환
     *  - Express의 /confirm-signature 호출
     *  - DB 저장 없이 영수증 or event 정보만 받아서 반환
     */
    @PostMapping("/confirm-signature")
    public Mono<ResponseEntity<MetamaskSignatureResponseDto>> confirmSignature(
            @AuthenticationPrincipal Integer userId,
            @RequestBody MetamaskSignatureRequestDto dto
    ) {
         dto.setUserId(userId);
        return metamaskService.confirmSignature(dto)
                .map(ResponseEntity::ok);
    }
}
