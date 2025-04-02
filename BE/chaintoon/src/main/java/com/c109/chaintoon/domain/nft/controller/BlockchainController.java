package com.c109.chaintoon.domain.nft.controller;

import com.c109.chaintoon.domain.nft.dto.blockchain.WalletBalance;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.NftMetadataItemResponseDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.NftMetadataResponseDto;
import com.c109.chaintoon.domain.nft.service.BlockchainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

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

    @GetMapping("/nft/{userId}")
    public ResponseEntity<List<NftMetadataItemResponseDto>> getNftMetadata(@PathVariable Integer userId) {
        List<NftMetadataItemResponseDto> dto = blockchainService.getNFTMetadataList(userId)
                .collectList() // Flux를 List로 변환
                .block();      // 블록킹 호출로 결과를 가져옴
        return ResponseEntity.ok(dto);
    }
}
