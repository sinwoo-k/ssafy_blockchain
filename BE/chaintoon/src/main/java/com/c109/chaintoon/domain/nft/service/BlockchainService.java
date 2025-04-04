package com.c109.chaintoon.domain.nft.service;

import com.c109.chaintoon.common.exception.ServerException;
import com.c109.chaintoon.common.image.ImageMergeService;
import com.c109.chaintoon.common.s3.service.S3Service;
import com.c109.chaintoon.domain.fanart.entity.Fanart;
import com.c109.chaintoon.domain.fanart.repository.FanartRepository;
import com.c109.chaintoon.domain.goods.entity.Goods;
import com.c109.chaintoon.domain.goods.repository.GoodsRepository;
import com.c109.chaintoon.domain.nft.dto.blockchain.*;
import com.c109.chaintoon.domain.nft.dto.blockchain.item.TransactionItem;
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
import com.c109.chaintoon.domain.user.service.NoticeService;
import com.c109.chaintoon.domain.webtoon.entity.EpisodeImage;
import com.c109.chaintoon.domain.webtoon.repository.EpisodeImageRepository;
import com.c109.chaintoon.domain.webtoon.repository.WebtoonRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigInteger;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlockchainService {

    private final WebClient webClient;
    private final WalletRepository walletRepository;
    private final WebtoonRepository webtoonRepository;
    private final S3Service s3Service;
    private final FanartRepository fanartRepository;
    private final GoodsRepository goodsRepository;
    private final EpisodeImageRepository episodeImageRepository;
    private final ImageMergeService imageMergeService;
    private final NoticeService noticeService;

    // 판매 등록 요청 메서드
    public Mono<BlockchainSaleResponseDto> registerSale(BlockchainSaleRequestDto saleRequestDto) {
        return webClient.post()
                .uri("nft/sell-nft")
                .bodyValue(saleRequestDto)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new ServerException("Express API 에러: " + errorBody)))
                )
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
                    .onStatus(HttpStatusCode::isError, clientResponse ->
                            clientResponse.bodyToMono(String.class)
                                    .flatMap(errorBody -> Mono.error(new ServerException("Express API 에러: " + errorBody)))
                    )
                    .bodyToMono(Void.class)
                    .onErrorResume(e -> Mono.error(new ServerException(" 조회 중 오류가 발생했습니다: " + e.getMessage())))
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
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new ServerException("Express API 에러: " + errorBody)))
                )
                .bodyToMono(WalletInfo.class)
                .onErrorResume(e -> Mono.error(new ServerException("지갑 잔액 조회 중 오류가 발생했습니다: " + e.getMessage())))
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
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new ServerException("Express API 에러: " + errorBody)))
                )
                .bodyToMono(WalletInfo.class)
                .map(walletInfo -> {
                    if (walletInfo == null || walletInfo.getBalances() == null || !walletInfo.getBalances().containsKey("eth")) {
                        throw new WalletBalanceNotFoundException("해당 userId(" + userId + ")의 지갑 잔액 정보를 가져올 수 없습니다.");
                    }
                    String ethBalanceStr = walletInfo.getBalances().get("eth");
                    double balance = Double.parseDouble(ethBalanceStr.replace("ETH", "").trim());
                    String walletAddress = walletInfo.getWalletAddress();
                    return new WalletBalance(walletAddress, balance);
                })
                .onErrorResume(e -> Mono.error(new ServerException("지갑 잔액 조회 중 오류가 발생했습니다: " + e.getMessage())));

    }

    public Mono<NftMetadataResponseDto> getNFTMetadata(Integer tokenId) {
        String url = "/nft/nft-details/" + tokenId;

        return webClient.get()
                .uri(url)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new ServerException("Express API 에러: " + errorBody)))
                )
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
                })
                .onErrorResume(e -> Mono.error(new ServerException("NFT 조회 중 오류가 발생했습니다: " + e.getMessage())));

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
                })
                .onErrorResume(e -> Flux.error(new ServerException("나의 보유 NFT 내역 조회 중 오류가 발생했습니다: " + e.getMessage())));

    }

    public Flux<TransactionItemResponseDto> getTransactionList(Integer userId) {
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
                .map(this::toTransactionItemResponseDto)
                .onErrorResume(e -> Flux.error(new ServerException("거래 내역 조회 중 오류가 발생했습니다: " + e.getMessage())));
    }

    public Mono<NftMintResponseDto> mintNft(NftMintRequestDto request, Integer userId) {
        // Express API의 NFT 민팅 엔드포인트 URL
        String url = "/nft/mint-nft";
        String ownerAddress = walletRepository.findWalletAddressByUserId(userId).orElse(null);
        String originatorAddress = walletRepository
                .findWalletAddressByUserId(webtoonRepository.findById(request.getWebtoonId()).get().getUserId())
                .orElse(null);
        String nftType = request.getType();
        List<String> imageUrls = new ArrayList<>();
        String s3Url = "";

        switch (nftType) {
            case "episode" -> {
                // episodeImageRepository에서 episodeId로 여러 이미지 S3 key를 가져온다고 가정
                imageUrls = episodeImageRepository.findByEpisodeId(request.getTypeId())
                        .stream()
                        .map(EpisodeImage::getImageUrl) // 각 EpisodeImage 엔티티가 S3 key를 반환한다고 가정
                        // S3 key를 presigned URL로 변환
                        .map(s3Service::getPresignedUrl)
                        .collect(Collectors.toList());
                s3Url = imageMergeService.mergeAndUploadNftImage(imageUrls, "episode");
            }
            case "fanart" -> {
                // fanart 타입에 대한 로직
                imageUrls = fanartRepository.findById(request.getTypeId())
                        .stream()
                        .map(Fanart::getFanartImage)
                        .collect(Collectors.toList());
                s3Url = imageUrls.isEmpty() ? "" : imageUrls.get(0);
            }
            case "goods" -> {
                // goods 타입에 대한 로직
                imageUrls = goodsRepository.findById(request.getTypeId())
                        .stream()
                        .map(Goods::getGoodsImage)
                        .collect(Collectors.toList());
                s3Url = imageUrls.isEmpty() ? "" : imageUrls.get(0);
            }
        }
        String s3Image = s3Service.getPresignedUrl(s3Url);
        // 기존 DTO의 값과 추가 필드를 Map에 담아서 요청 바디로 전송
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("webtoonId", request.getWebtoonId());
        requestBody.put("type", request.getType());
        requestBody.put("typeId", request.getTypeId());
        requestBody.put("s3Url", s3Image);
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

    public Mono<String> getNonce(String walletAddress) {
        String url = "/nft/nonce?walletAddress=" + walletAddress;
        ObjectMapper mapper = new ObjectMapper();

        return webClient.get()
                .uri(url)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new ServerException("Express API 에러: " + errorBody)))
                )
                .bodyToMono(String.class)
                .map(String::trim)
                .map(response -> {
                    // response가 이미 JSON 문자열이라면, 파싱하여 내부 nonce 값 추출
                    try {
                        Map<String, String> map = mapper.readValue(response, Map.class);
                        return map.get("nonce");
                    } catch (Exception e) {
                        throw new ServerException("nonce 응답 파싱 실패");
                    }
                })
                .onErrorResume(e ->
                        Mono.error(new ServerException("논스값 조회중 오류가 발생했습니다: " + e.getMessage()))
                );
    }
    @Async
    public CompletableFuture<Void> createWalletAsync(Integer userId) {
        String url = "/nft/create-wallet/" + userId;
        return webClient.post()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .map(String::trim)
                .doOnSuccess(walletAddress -> {
                    log.info("User {} 지갑 생성 완료 : {}", userId, walletAddress);
                    noticeService.addBlockchainNetworkSuccessNotice(userId, "지갑 생성 성공");

                })
                .doOnError(e -> {
                    log.error("User {} 지갑 생성 중 오류 발생: {}", userId, e.getMessage());
                    noticeService.addBlockchainNetworkFailNotice(userId, "지갑 생성 실패");
                })
                .then()
                .toFuture();
    }

    public Mono<MetamaskWalletResponseDto> connectWallet(MetamaskWallet request) {
        if (request == null || request.getSignature() == null || request.getMessage() == null) {
            throw new IllegalArgumentException("서명과 논스값이 누락되었습니다.");
        }
        String url = "/nft/connect-wallet"; // Express API 경로

        return webClient.post()
                .uri(url)
                .bodyValue(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new ServerException("Express API 에러: " + errorBody)))
                )
                .bodyToMono(MetamaskWalletResponseDto.class)
                .doOnNext(response -> {
                    System.out.println("Received Wallet Response: " + response);
                })
                .onErrorResume(e ->
                        Mono.error(new ServerException("Metamask 지갑연동중 오류가 발생했습니다: " + e.getMessage()))
                );
    }


    private TransactionItemResponseDto toTransactionItemResponseDto(TransactionItem item) {
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
                .timeStamp(formattedTime)
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
    }
}
