package com.c109.chaintoon.domain.nft.service;

import com.c109.chaintoon.domain.nft.dto.blockchain.request.BlockchainBuyRequestDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.request.BlockchainSaleRequestDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.BlockchainSaleResponseDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.WalletBalance;
import com.c109.chaintoon.domain.nft.dto.blockchain.WalletInfo;
import com.c109.chaintoon.domain.nft.exception.WalletBalanceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlockchainService {

    private final WebClient webClient;

    // 판매 등록 요청 메서드
    public Mono<BlockchainSaleResponseDto> registerSale(BlockchainSaleRequestDto saleRequestDto) {
        return webClient.post()
                .uri("nft/sell-nft")
                .bodyValue(saleRequestDto)
                .retrieve()
                .bodyToMono(BlockchainSaleResponseDto.class)
                .doOnSuccess(response -> log.info("NFT 판매 등록 성공: {}", response))
                .doOnError(error -> log.error("NFT 판매 등록 실패", error));
    }

    // 구매 요청 매서드
    public void registerBuy(BlockchainBuyRequestDto buyRequestDto) {
        try {
            webClient.post()
                    .uri("nft/buy-nft")
                    .bodyValue(buyRequestDto)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
            log.info("블록체인 구매 요청 성공: {}", buyRequestDto);
        } catch (Exception e) {
            log.error("블록체인 구매 요청 실패: {}", e.getMessage());
        }
    }

    // 즉시 구매용 - 지갑 잔액 조회
    public WalletBalance getWalletBalance(Integer userId) {
        // 호출할 API URL
        String url = "/nft/wallet-info/" + userId;

        System.out.println(url);

        // WebClient로 GET 요청 보내고 응답 받기
        WalletInfo walletInfo = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(WalletInfo.class)
                .block();

        // walletInfo 객체가 null이거나, 객체의 balances 필드가 null이거나, eth키가 존재 하지 않으면 에러
        if (walletInfo == null || walletInfo.getBalances() == null || !walletInfo.getBalances().containsKey("eth")){
            throw new WalletBalanceNotFoundException("해당 userId(" + userId + ")의 지갑 잔액 정보를 가져올 수 없습니다.");
        }

        // walletInfo의 balances 맵에서 "eth" 키에 해당하는 값 가져오기
        String ethBalanceStr = walletInfo.getBalances().get("eth");

        System.out.println(ethBalanceStr);
        double balance = Double.parseDouble(ethBalanceStr.replace("ETH", "").trim());


        System.out.println("balance = " + balance);

        return new WalletBalance(balance);
    }

    // 백그라운드용 지갑 잔액 조회
    public Mono<WalletBalance> getWalletBalanceAsync(Integer userId) {
        String url = "/nft/wallet-info/" + userId;
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(WalletInfo.class)
                .map(walletInfo -> {
                    if (walletInfo == null || walletInfo.getBalances() == null || !walletInfo.getBalances().containsKey("eth")){
                        throw new WalletBalanceNotFoundException("해당 userId(" + userId + ")의 지갑 잔액 정보를 가져올 수 없습니다.");
                    }
                    String ethBalanceStr = walletInfo.getBalances().get("eth");
                    double balance = Double.parseDouble(ethBalanceStr.replace("ETH", "").trim());
                    return new WalletBalance(balance);
                });
    }

}
