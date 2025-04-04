package com.c109.chaintoon.domain.nft.controller;

import com.c109.chaintoon.domain.nft.dto.blockchain.WalletBalance;
import com.c109.chaintoon.domain.nft.dto.blockchain.request.NftMintRequestDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.NftMetadataItemResponseDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.NftMetadataResponseDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.NftMintResponseDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.TransactionItemResponseDto;
import com.c109.chaintoon.domain.nft.service.BlockchainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
        NftMetadataResponseDto dto = blockchainService.getNFTMetadata(tokenId)
                .block();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/nft-list")
    public ResponseEntity<List<NftMetadataItemResponseDto>> getNftMetadata(@AuthenticationPrincipal Integer userId) {
        List<NftMetadataItemResponseDto> dto = blockchainService.getNFTMetadataList(userId)
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
    public ResponseEntity<NftMintResponseDto> mintNft(@AuthenticationPrincipal Integer userId,@RequestBody NftMintRequestDto request) {
        NftMintResponseDto response = blockchainService.mintNft(request, userId).block();
        return ResponseEntity.ok(response);
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
