package com.c109.chaintoon.domain.nft.controller;

import com.c109.chaintoon.domain.nft.dto.blockchain.NftRecordDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.WalletBalance;
import com.c109.chaintoon.domain.nft.dto.blockchain.request.NftMintRequestDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.NftMetadataItemResponseDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.NftMetadataResponseDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.TransactionItemResponseDto;
import com.c109.chaintoon.domain.nft.entity.Nft;
import com.c109.chaintoon.domain.nft.service.BlockchainService;
import com.c109.chaintoon.domain.user.service.NoticeService;
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
    private final NoticeService noticeService;
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
    @PostMapping("/record-mint")
    public ResponseEntity<?> recordMint(
            @RequestBody NftRecordDto dto
    ) {
        if (dto.getUserId() == null || dto.getWebtoonId() == null ||
                dto.getType() == null || dto.getTypeId() == null || dto.getTokenId() == null) {
            return ResponseEntity.badRequest().body("필수 파라미터가 누락되었습니다.");
        }
        try {
            Nft savedNft = blockchainService.recordMint(dto);
            noticeService.addBlockchainNetworkSuccessNotice(dto.getUserId(), "NFT 민팅이 성공적으로 완료되었습니다.");
            return ResponseEntity.ok(savedNft);
        } catch (Exception e) {
            noticeService.addBlockchainNetworkFailNotice(dto.getUserId(), "NFT 민팅 실패하였습니다. 관리자에게 문의해주세요 ");
            return ResponseEntity.badRequest().body("NFT 기록 실패: " + e.getMessage());
        }
    }

}
