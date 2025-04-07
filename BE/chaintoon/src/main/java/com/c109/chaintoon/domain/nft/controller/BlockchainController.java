package com.c109.chaintoon.domain.nft.controller;

import com.c109.chaintoon.domain.nft.dto.blockchain.WalletBalance;
import com.c109.chaintoon.domain.nft.dto.blockchain.request.NftMintRequestDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.NftMetadataItemResponseDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.NftMetadataResponseDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.TransactionItemResponseDto;
import com.c109.chaintoon.domain.nft.service.BlockchainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/blockchain")
public class BlockchainController {

    private final BlockchainService blockchainService;

    @GetMapping("/nft-detail/{tokenId}")
    public ResponseEntity<NftMetadataResponseDto> getNftMetadataDetail(@PathVariable Integer tokenId) {
        NftMetadataResponseDto dto = blockchainService.getNftMetadata(tokenId)
                .block();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/nft-list")
    public ResponseEntity<List<NftMetadataItemResponseDto>> getNftMetadata(@AuthenticationPrincipal Integer userId) {
        List<NftMetadataItemResponseDto> dto = blockchainService.getNftMetadataList(userId)
                .collectList() // Flux를 List로 변환
                .block();      // 블록킹 호출로 결과를 가져옴
        return ResponseEntity.ok(dto);
    }
    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionItemResponseDto>> getTransactions(@AuthenticationPrincipal Integer userId) {
        List<TransactionItemResponseDto> transactions = blockchainService.getTransactionList(userId)
                .collectList()
                .block();
        return ResponseEntity.ok(transactions);
    }
    @PostMapping("/mint")
    public ResponseEntity<String> mintNft(@AuthenticationPrincipal Integer userId, @RequestBody NftMintRequestDto request) {
        // 비동기 민팅 작업 호출 (백그라운드에서 실행됨)
        blockchainService.mintNftAsync(request, userId);
        // 즉시 요청이 접수되었음을 응답
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("NFT 민팅 요청이 접수되었습니다.");
    }
    @GetMapping("/wallet-info")
    public ResponseEntity<WalletBalance> getWalletInfo(@AuthenticationPrincipal Integer userId) {
        return ResponseEntity.ok(blockchainService.getWalletBalanceAsync(userId).block());
    }
    @GetMapping("/nonce/{walletAddress}")
    public ResponseEntity<Map<String, String>> getNonce(@PathVariable String walletAddress) {
        String nonce = blockchainService.getNonce(walletAddress).block();
        Map<String, String> response = new HashMap<>();
        response.put("nonce", nonce);
        return ResponseEntity.ok(response);
    }
}
