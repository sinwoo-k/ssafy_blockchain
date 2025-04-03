package com.c109.chaintoon.domain.nft.service;

import com.c109.chaintoon.common.exception.ServerException;
import com.c109.chaintoon.domain.nft.dto.blockchain.*;
import com.c109.chaintoon.domain.nft.dto.blockchain.request.BlockchainBuyRequestDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.request.BlockchainSaleRequestDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.request.NftMintRequestDto;
import com.c109.chaintoon.domain.nft.dto.blockchain.response.*;
import com.c109.chaintoon.domain.nft.dto.blockchain.wrapper.NftMetadataListWrapper;
import com.c109.chaintoon.domain.nft.dto.blockchain.wrapper.NftMetadataWrapper;
import com.c109.chaintoon.domain.nft.dto.blockchain.wrapper.TransactionListWrapper;
import com.c109.chaintoon.domain.nft.exception.NFTMetadataNotfoundException;
import com.c109.chaintoon.domain.nft.exception.WalletBalanceNotFoundException;
import com.c109.chaintoon.domain.nft.repository.WalletRepository;
import com.c109.chaintoon.domain.webtoon.repository.WebtoonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigInteger;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlockchainService {

    private final WebClient webClient;
    private final WalletRepository walletRepository;
    private final WebtoonRepository webtoonRepository;
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
        if (walletInfo == null || walletInfo.getBalances() == null || !walletInfo.getBalances().containsKey("eth")) {
            throw new WalletBalanceNotFoundException("해당 userId(" + userId + ")의 지갑 잔액 정보를 가져올 수 없습니다.");
        }

        // walletInfo의 balances 맵에서 "eth" 키에 해당하는 값 가져오기
        String ethBalanceStr = walletInfo.getBalances().get("eth");

        System.out.println(ethBalanceStr);
        double balance = Double.parseDouble(ethBalanceStr.replace("ETH", "").trim());
        String walletAddress = walletInfo.getWalletAddress();

        System.out.println("balance = " + balance);

        return new WalletBalance(walletAddress, balance);
    }

    // 백그라운드용 지갑 잔액 조회
    public Mono<WalletBalance> getWalletBalanceAsync(Integer userId) {
        String url = "/nft/wallet-info/" + userId;
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(WalletInfo.class)
                .map(walletInfo -> {
                    if (walletInfo == null || walletInfo.getBalances() == null || !walletInfo.getBalances().containsKey("eth")) {
                        throw new WalletBalanceNotFoundException("해당 userId(" + userId + ")의 지갑 잔액 정보를 가져올 수 없습니다.");
                    }
                    String ethBalanceStr = walletInfo.getBalances().get("eth");
                    double balance = Double.parseDouble(ethBalanceStr.replace("ETH", "").trim());
                    String walletAddress = walletInfo.getWalletAddress();
                    return new WalletBalance(walletAddress, balance);
                });
    }

    public Mono<NftMetadataResponseDto> getNFTMetadata(Integer tokenId) {
        String url = "/nft/nft-details/" + tokenId;

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(NftMetadataWrapper.class)
                .map(wrapper -> {
                    NftMetadata nftMetadata = wrapper.getData();
                    if (nftMetadata == null || nftMetadata.getTokenId() == null) {
                        throw new NFTMetadataNotfoundException("해당 토큰 아이디에 해당하는 NFT가 존재하지 않습니다.");
                    }
                    return NftMetadataResponseDto.builder()
                            .tokenId(nftMetadata.getTokenId())
                            .title(nftMetadata.getTitle())
                            .description(nftMetadata.getDescription())
                            .image(nftMetadata.getImage())
                            .originalCreatorWallet(nftMetadata.getWallets().getOriginalCreator())
                            .originalCreatorUserId(walletRepository.findUserIdByWalletAddress(nftMetadata.getWallets().getOriginalCreator()).orElse(null))
                            .ownerWallet(nftMetadata.getWallets().getOwner())
                            .ownerWalletUserId(walletRepository.findUserIdByWalletAddress(nftMetadata.getWallets().getOwner()).orElse(null))
                            .build();
                });
    }

    public Flux<NftMetadataItemResponseDto> getNFTMetadataList(Integer userId) {
        String userAddress = walletRepository.findWalletAddressByUserId(userId).orElse(null);
        String url = "/nft/wallet-nfts/" + userAddress;

        return webClient.get()
                .uri(url)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new ServerException("Express API 에러: " + errorBody)))
                )
                .bodyToMono(NftMetadataListWrapper.class)
                .flatMapMany(wrapper -> {
                    if(wrapper == null || wrapper.getData() == null) {
                        return Flux.empty();
                    }
                    return Flux.fromIterable(wrapper.getData());
                })
                .map(item-> {
                    if (item == null || item.getTokenId() == null) {
                        throw new NFTMetadataNotfoundException("보유한 NFT가 없습니다.");
                    }

                    return NftMetadataItemResponseDto.builder()
                            .tokenId(item.getTokenId())
                            .title(item.getMetadata().getTitle())
                            .description(item.getMetadata().getDescription())
                            .image(item.getMetadata().getImage())
                            .originalCreatorWallet(item.getMetadata().getWallets().getOriginalCreator())
                            .originalCreatorUserId(walletRepository.findUserIdByWalletAddress(item.getMetadata().getWallets().getOriginalCreator()).orElse(null))
                            .ownerWallet(item.getMetadata().getWallets().getOwner())
                            .ownerWalletUserId(walletRepository.findUserIdByWalletAddress(item.getMetadata().getWallets().getOwner()).orElse(null))
                            .build();
                });
    }

    public Flux<TransactionItemResponseDto> getTransactionList(Integer userId) {
        // 실제 API URL로 변경
        String userAddress = walletRepository.findWalletAddressByUserId(userId).orElse(null);
        String url = "/nft/transactions/" + userAddress;

        return webClient.get()
                .uri(url)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new ServerException("Express API 에러: " + errorBody)))
                )
                .bodyToMono(TransactionListWrapper.class)
                .flatMapMany(wrapper -> {
                    if (wrapper == null || wrapper.getData() == null) {
                        return Flux.empty();
                    }
                    return Flux.fromIterable(wrapper.getData());
                })
                .map(item -> {
                    // 숫자값들을 BigInteger를 사용해 십진수 문자열로 변환하고, 단위 붙이기
                    String blockNumberDec = new BigInteger(item.getBlockNumber()).toString();

                    // 타임스탬프를 사람이 읽기 쉬운 시간 문자열로 변환 (예: "yyyy-MM-dd HH:mm:ss")
                    long epochSeconds = Long.parseLong(item.getTimeStamp());
                    String formattedTime = Instant.ofEpochSecond(epochSeconds)
                            .atZone(ZoneId.systemDefault())
                            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

                    String nonceDec = new BigInteger(item.getNonce()).toString();
                    String gasDec = new BigInteger(item.getGas()) + " units";
                    String gasPriceDec = new BigInteger(item.getGasPrice()).toString();
                    String confirmationsDec = new BigInteger(item.getConfirmations()).toString();
                    String gasUsedDec = new BigInteger(item.getGasUsed()) + " units";
                    String cumulativeGasUsedDec = new BigInteger(item.getCumulativeGasUsed()) + " units";

                    return TransactionItemResponseDto.builder()
                            .blockNumber(blockNumberDec)
                            .timeStamp(formattedTime) // 사람이 읽을 수 있는 시간 문자열
                            .hash(item.getHash())
                            .nonce(nonceDec)
                            .blockHash(item.getBlockHash())
                            .transactionIndex(item.getTransactionIndex())
                            .from(item.getFrom())
                            .to(item.getTo())
                            .value(item.getValue())
                            .gas(gasDec)
                            .gasPrice(gasPriceDec)
                            .isError(item.getIsError())
                            .txreceiptStatus(item.getTxreceipt_status())
                            .input(item.getInput())
                            .contractAddress(item.getContractAddress())
                            .cumulativeGasUsed(cumulativeGasUsedDec)
                            .gasUsed(gasUsedDec)
                            .confirmations(confirmationsDec)
                            .methodId(item.getMethodId())
                            .functionName(item.getFunctionName())
                            .build();
                })
                .onErrorResume(e -> Flux.error(new ServerException("거래 내역 조회 중 오류가 발생했습니다: " + e.getMessage())));

    }

    public Mono<NftMintResponseDto> mintNft(NftMintRequestDto request, Integer userId) {
        // Express API의 NFT 민팅 엔드포인트 URL
        String url = "/nft/mint-nft";
        String ownerAddress = walletRepository.findWalletAddressByUserId(userId).orElse(null);
        String originatorAddress = walletRepository
                .findWalletAddressByUserId(webtoonRepository.findById(request.getWebtoonId()).get().getUserId())
                .orElse(null);

        // 기존 DTO의 값과 추가 필드를 Map에 담아서 요청 바디로 전송
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("webtoonId", request.getWebtoonId());
        requestBody.put("type", request.getType());
        requestBody.put("typeId", request.getTypeId());
        requestBody.put("s3Url", request.getS3Url());
        requestBody.put("userId", userId);
        requestBody.put("owner", ownerAddress);
        requestBody.put("originalCreator", originatorAddress);

        return webClient.post()
                .uri(url)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new ServerException("Express API 에러: " + errorBody)))
                )
                .bodyToMono(NftMintResponseDto.class)
                .onErrorResume(e -> Mono.error(new ServerException("NFT 등록중 오류가 발생했습니다: " + e.getMessage())));

    }
}
