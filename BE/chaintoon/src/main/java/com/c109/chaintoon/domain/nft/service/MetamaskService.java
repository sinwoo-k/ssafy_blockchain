package com.c109.chaintoon.domain.nft.service;

import com.c109.chaintoon.common.exception.ServerException;
import com.c109.chaintoon.common.image.ImageMergeService;
import com.c109.chaintoon.common.s3.service.S3Service;
import com.c109.chaintoon.domain.fanart.entity.Fanart;
import com.c109.chaintoon.domain.fanart.repository.FanartRepository;
import com.c109.chaintoon.domain.goods.entity.Goods;
import com.c109.chaintoon.domain.goods.repository.GoodsRepository;
import com.c109.chaintoon.domain.nft.dto.blockchain.request.NftMintRequestDto;
import com.c109.chaintoon.domain.nft.dto.metamask.request.MetamaskBuyRequestDto;
import com.c109.chaintoon.domain.nft.dto.metamask.request.MetamaskSellRequestDto;
import com.c109.chaintoon.domain.nft.dto.metamask.request.MetamaskSignatureRequestDto;
import com.c109.chaintoon.domain.nft.dto.metamask.response.MetamaskRequestResponseDto;
import com.c109.chaintoon.domain.nft.dto.metamask.response.MetamaskSignatureResponseDto;
import com.c109.chaintoon.domain.nft.repository.WalletRepository;
import com.c109.chaintoon.domain.webtoon.entity.EpisodeImage;
import com.c109.chaintoon.domain.webtoon.repository.EpisodeImageRepository;
import com.c109.chaintoon.domain.webtoon.repository.WebtoonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 메타마스크 민팅/판매/구매 요청과 단일 컨펌(서명 검증/트랜잭션)을
 * Express 서버로 중계하는 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MetamaskService {

    private final WebClient webClient;
    private final WalletRepository walletRepository;
    private final WebtoonRepository webtoonRepository;
    private final FanartRepository fanartRepository;
    private final GoodsRepository goodsRepository;
    private final EpisodeImageRepository episodeImageRepository;
    private final S3Service s3Service;
    private final ImageMergeService imageMergeService;
    /**
     * 메타마스크 민팅 요청 (1단계: nonce 생성 / Redis에 저장)
     *   - Express: POST /metamask/mint-request
     */
    public Mono<MetamaskRequestResponseDto> mintRequest(NftMintRequestDto request, Integer userId) {
        String ownerAddress = walletRepository.findWalletAddressByUserId(userId).orElse(null);

        String originatorAddress = walletRepository
                .findWalletAddressByUserId(
                        webtoonRepository.findById(request.getWebtoonId()).get().getUserId()
                ).orElse(null);

        String nftType = request.getType();
        List<String> imageUrls = new ArrayList<>();
        String s3Url = "";

        // 3. NFT 타입에 따른 이미지 URL 처리
        switch (nftType) {
            case "episode" -> {
                imageUrls = episodeImageRepository.findByEpisodeId(request.getTypeId())
                        .stream()
                        .map(EpisodeImage::getImageUrl)
                        .map(s3Service::getPresignedUrl)
                        .collect(Collectors.toList());
                s3Url = imageMergeService.mergeAndUploadNftImage(imageUrls, "episode");
            }
            case "fanart" -> {
                imageUrls = fanartRepository.findById(request.getTypeId())
                        .stream()
                        .map(Fanart::getFanartImage)
                        .collect(Collectors.toList());
                s3Url = imageUrls.isEmpty() ? "" : imageUrls.get(0);
            }
            case "goods" -> {
                imageUrls = goodsRepository.findById(request.getTypeId())
                        .stream()
                        .map(Goods::getGoodsImage)
                        .collect(Collectors.toList());
                s3Url = imageUrls.isEmpty() ? "" : imageUrls.get(0);
            }
        }
        String s3Image = s3Service.getPresignedUrl(s3Url);

        // 4. Express API에 전달할 요청 바디 구성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("webtoonId", request.getWebtoonId());
        requestBody.put("type", request.getType());
        requestBody.put("typeId", request.getTypeId());
        requestBody.put("s3Url", s3Image);
        requestBody.put("userId", userId);
        requestBody.put("owner", ownerAddress);
        requestBody.put("originalCreator", originatorAddress);

        return webClient.post()
                .uri("/nft/metamask/mint-request")
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new ServerException("민팅 요청 실패(Express): " + errorBody)))
                )
                .bodyToMono(MetamaskRequestResponseDto.class)
                .doOnSuccess(resp -> log.info("메타마스크 민팅 요청 성공: {}", resp))
                .doOnError(e -> log.error("메타마스크 민팅 요청 에러", e));
    }

    /**
     * 메타마스크 판매 요청 (1단계: nonce 생성)
     *   - Express: POST /metamask/sell-request
     */
    public Mono<MetamaskRequestResponseDto> sellRequest(MetamaskSellRequestDto dto) {
        System.out.println(dto.getUserId());
        return webClient.post()
                .uri("/nft/metamask/sell-request")
                .bodyValue(dto)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new ServerException("판매 요청 실패(Express): " + errorBody)))
                )
                .bodyToMono(MetamaskRequestResponseDto.class)
                .doOnSuccess(resp -> log.info("메타마스크 판매 요청 성공: {}", resp))
                .doOnError(e -> log.error("메타마스크 판매 요청 에러", e));
    }

    /**
     * 메타마스크 구매 요청 (1단계: nonce 생성)
     *   - Express: POST /metamask/buy-request
     */
    public Mono<MetamaskRequestResponseDto> buyRequest(MetamaskBuyRequestDto dto) {
        return webClient.post()
                .uri("/nft/metamask/buy-request")
                .bodyValue(dto)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new ServerException("구매 요청 실패(Express): " + errorBody)))
                )
                .bodyToMono(MetamaskRequestResponseDto.class)
                .doOnSuccess(resp -> log.info("메타마스크 구매 요청 성공: {}", resp))
                .doOnError(e -> log.error("메타마스크 구매 요청 에러", e));
    }

    /**
     * (2단계) 메타마스크 서명 검증 + 최종 트랜잭션 처리
     *   - Express: POST /confirm-signature
     */
    public Mono<MetamaskSignatureResponseDto> confirmSignature(MetamaskSignatureRequestDto dto) {
        return webClient.post()
                .uri("/nft/confirm-signature")
                .bodyValue(dto)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> Mono.error(new ServerException("서명 검증 실패(Express): " + errorBody)))
                )
                .bodyToMono(MetamaskSignatureResponseDto.class)
                .doOnSuccess(resp -> log.info("메타마스크 서명 확인 완료: {}", resp))
                .doOnError(e -> log.error("메타마스크 서명 확인 에러", e));
    }

}
