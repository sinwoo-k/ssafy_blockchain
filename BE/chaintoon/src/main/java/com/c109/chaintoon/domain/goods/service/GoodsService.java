package com.c109.chaintoon.domain.goods.service;

import com.c109.chaintoon.common.exception.UnauthorizedAccessException;
import com.c109.chaintoon.common.s3.service.S3Service;
import com.c109.chaintoon.domain.fanart.entity.Fanart;
import com.c109.chaintoon.domain.fanart.specification.FanartSpecification;
import com.c109.chaintoon.domain.goods.dto.request.GoodsRequestDto;
import com.c109.chaintoon.domain.goods.dto.response.GoodsListResponseDto;
import com.c109.chaintoon.domain.goods.dto.response.WebtoonGoodsResponseDto;
import com.c109.chaintoon.domain.goods.entity.Goods;
import com.c109.chaintoon.domain.goods.exception.GoodsNotFoundException;
import com.c109.chaintoon.domain.goods.repository.GoodsRepository;
import com.c109.chaintoon.domain.goods.specification.GoodsSpecification;
import com.c109.chaintoon.domain.user.entity.User;
import com.c109.chaintoon.domain.user.exception.UserIdNotFoundException;
import com.c109.chaintoon.domain.user.repository.UserRepository;
import com.c109.chaintoon.domain.webtoon.entity.Webtoon;
import com.c109.chaintoon.domain.webtoon.exception.WebtoonNotFoundException;
import com.c109.chaintoon.domain.webtoon.repository.WebtoonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoodsService {

    private final WebtoonRepository webtoonRepository;
    private final GoodsRepository goodsRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    // 굿즈 등록
    public GoodsListResponseDto createGoods(GoodsRequestDto goodsRequestDto, MultipartFile goodsImage) {
        // 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(goodsRequestDto.getWebtoonId())
                .orElseThrow(() -> new WebtoonNotFoundException(goodsRequestDto.getWebtoonId()));

        // 등록한 사람 정보 조회 (예: 닉네임)
        User user = userRepository.findById(goodsRequestDto.getUserId())
                .orElseThrow(() -> new UserIdNotFoundException(goodsRequestDto.getUserId()));

        // 굿즈 엔티티 생성
        Goods goods = Goods.builder()
                .userId(goodsRequestDto.getUserId())
                .webtoonId(goodsRequestDto.getWebtoonId())
                .goodsName(goodsRequestDto.getGoodsName())
                .build();

        // 굿즈 저장
        Goods savedGoods = goodsRepository.save(goods);

        String goodsImageUrl = uploadGoodsImage(savedGoods.getGoodsId(), goodsImage);
        savedGoods.setGoodsImage(goodsImageUrl);
        goodsRepository.save(savedGoods);

        return GoodsListResponseDto.builder()
                .goodsId(savedGoods.getGoodsId())
                .userId(savedGoods.getUserId())
                .webtoonId(savedGoods.getWebtoonId())
                .goodsName(savedGoods.getGoodsName())
                .goodsImage(savedGoods.getGoodsImage())
                .build();
    }

    private String uploadGoodsImage(Integer goodsId, MultipartFile file) {
        return s3Service.uploadFile(file, "goods/" + goodsId + "/image");
    }

    // 웹툰별 굿즈 목록 조회
    public WebtoonGoodsResponseDto getGoodsByWebtoon(Integer webtoonId, int page, int pageSize, String orderBy) {
        // 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(webtoonId)
                .orElseThrow(() -> new WebtoonNotFoundException(webtoonId));

        // 2. 작가(닉네임) 조회: 웹툰의 userId를 이용하여 User 엔티티를 조회
        User user = userRepository.findById(webtoon.getUserId())
                .orElseThrow(() -> new UserIdNotFoundException(webtoon.getUserId()));
        String writer = user.getNickname();

        // 3. Pageable 객체 생성 (page는 프론트에서 1부터 전달한다고 가정 → 0-based로 변환)
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort(orderBy));

        // 4. 해당 웹툰에 속한 굿즈 목록 조회 (Page 객체)
        Page<Goods> goodsPage = goodsRepository.findAllByWebtoonIdAndDeleted(webtoonId, "N", pageable);

        // 5. Goods 엔티티를 GoodsListResponseDto로 변환 (굿즈 목록)
        List<GoodsListResponseDto> goodsList = goodsPage.getContent().stream()
                .map(goods -> GoodsListResponseDto.builder()
                        .goodsId(goods.getGoodsId())
                        .userId(goods.getUserId())
                        .webtoonId(goods.getWebtoonId())
                        .goodsName(goods.getGoodsName())
                        .goodsImage(goods.getGoodsImage())
                        .build())
                .collect(Collectors.toList());

        // 6. WebtoonGoodsResponseDto 생성하여 반환
        return WebtoonGoodsResponseDto.builder()
                .webtoonId(webtoon.getWebtoonId())
                .webtoonName(webtoon.getWebtoonName())
                .writer(writer)
                .genre(webtoon.getGenre())
                .garoThumbnail(webtoon.getGaroThumbnail())
                .seroThumbnail(webtoon.getSeroThumbnail())
                .totalGoodsCount((int) goodsPage.getTotalElements())
                .goodsList(goodsList)
                .build();
    }

    // 굿즈 수정
    public GoodsListResponseDto updateGoods(Integer goodsId, GoodsRequestDto goodsRequestDto, MultipartFile goodsImage) {
        // 수정할 굿즈 조회
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new GoodsNotFoundException(goodsId)); // GoodsNotFoundException은 별도 정의 필요

        // 요청한 사용자가 굿즈를 등록한 사람과 일치하는지 확인
        if (!goods.getUserId().equals(goodsRequestDto.getUserId())) {
            throw new UnauthorizedAccessException("수정 권한이 없습니다.");
        }

        // 굿즈가 속한 웹툰 조회
        Webtoon webtoon = webtoonRepository.findById(goods.getWebtoonId())
                .orElseThrow(() -> new WebtoonNotFoundException(goods.getWebtoonId()));

        // 수정 가능한 필드 업데이트
        // 굿즈명이 전달되었으면 업데이트
        if (goodsRequestDto.getGoodsName() != null) {
            goods.setGoodsName(goodsRequestDto.getGoodsName());
        }

        // 이미지 업데이트
        if (goodsImage != null && !goodsImage.isEmpty()) {
            if(goods.getGoodsImage() != null) {
                s3Service.deleteFile(goods.getGoodsImage());
            }
            String goodsImageUrl = uploadGoodsImage(goods.getGoodsId(), goodsImage);
            goods.setGoodsImage(goodsImageUrl);
        } else if (goodsRequestDto.getGoodsImage() != null) {
            // 이미지 파일 없이 이미지 URL만 변경하는 경우
            goods.setGoodsImage(goodsRequestDto.getGoodsImage());
        }

        // 굿즈 수정 저장
        Goods updatedGoods = goodsRepository.save(goods);

        // 개별 굿즈 정보를 담은 DTO 생성
        return GoodsListResponseDto.builder()
                .goodsId(updatedGoods.getGoodsId())
                .userId(updatedGoods.getUserId())
                .webtoonId(updatedGoods.getWebtoonId())
                .goodsName(updatedGoods.getGoodsName())
                .goodsImage(updatedGoods.getGoodsImage())
                .build();
    }

    // 굿즈 삭제
    public void deleteGoods(Integer goodsId, Integer userId) {
        // 삭제할 굿즈 조회
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new GoodsNotFoundException(goodsId)); // GoodsNotFoundException은 별도로 정의

        // 요청한 사용자가 등록한 사용자와 일치해야 함
        if (!goods.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("삭제 권한이 없습니다.");
        }

        // 소프트 삭제: deleted 플래그를 "Y"로 변경하고 저장
        goods.setDeleted("Y");
        goodsRepository.save(goods);
    }

    // 굿즈 검색
    public List<GoodsListResponseDto> searchGoods(int page, int pageSize, String keyword) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, getSort("latest"));

        // 키워드에 대해 제목이 포함되는 조건을 specification으로 구성
        Specification<Goods> spec = Specification.where(GoodsSpecification.goodsNameContains(keyword))
                .and((root, query, cb) ->cb.equal(root.get("deleted"), "N"));

        Page<Goods> resultPage = goodsRepository.findAll(spec, pageable);

        List<GoodsListResponseDto> dtos = resultPage.getContent().stream()
                .map(goods -> GoodsListResponseDto.builder()
                        .goodsId(goods.getGoodsId())
                        .userId(goods.getUserId())
                        .webtoonId(goods.getWebtoonId())
                        .goodsName(goods.getGoodsName())
                        .goodsImage(goods.getGoodsImage())
                        .build())
                .collect(Collectors.toList());

        return dtos;
    }

    private Sort getSort(String orderBy) {
        if ("latest".equalsIgnoreCase(orderBy)) {
            // 최신순: 생성일 내림차순
            return Sort.by(Sort.Direction.DESC, "createdAt");
        } else if ("oldest".equalsIgnoreCase(orderBy)) {
            // 오래된순: 생성일 오름차순
            return Sort.by(Sort.Direction.ASC, "createdAt");
        } else {
            // 기본값: 최신순
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
    }
}
