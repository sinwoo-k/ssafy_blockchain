package com.c109.chaintoon.domain.goods.controller;

import com.c109.chaintoon.domain.goods.dto.request.GoodsRequestDto;
import com.c109.chaintoon.domain.goods.dto.response.GoodsResponseDto;
import com.c109.chaintoon.domain.goods.dto.response.WebtoonGoodsResponseDto;
import com.c109.chaintoon.domain.goods.service.GoodsService;
import com.c109.chaintoon.domain.search.dto.response.SearchResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/goods")
@RequiredArgsConstructor
public class GoodsController {

    private final GoodsService goodsService;

    // 굿즈 등록
    @PostMapping
    public ResponseEntity<?> createGoods(
            @AuthenticationPrincipal Integer userId,
            @Valid @RequestPart("goods") GoodsRequestDto goodsRequestDto,
            @RequestPart("goodsImage") MultipartFile goodsImage
    ) {
        GoodsResponseDto responseDto = goodsService.createGoods(userId, goodsRequestDto, goodsImage);
        return new ResponseEntity<>(responseDto,HttpStatus.CREATED);
    }

    // 굿즈 목록 조회
    @GetMapping("/webtoons/{webtoonId}")
    public ResponseEntity<?> getGoodsListByWebtoon(
            @PathVariable Integer webtoonId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "latest") String orderBy) {
        WebtoonGoodsResponseDto response = goodsService.getGoodsByWebtoon(webtoonId, page, pageSize, orderBy);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    // 굿즈 수정
    @PatchMapping("/{goodsId}")
    public ResponseEntity<?> updateGoods(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer goodsId,
            @RequestPart(value = "goods", required = false) GoodsRequestDto goodsRequestDto,
            @RequestPart(value = "goodsImage", required = false) MultipartFile goodsImage) {
        GoodsResponseDto response = goodsService.updateGoods(userId, goodsId, goodsRequestDto, goodsImage);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    // 굿즈 삭제
    @DeleteMapping("/{goodsId}")
    public ResponseEntity<?> deleteGoods(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer goodsId
            ) {
        goodsService.deleteGoods(goodsId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 굿즈 검색
    @GetMapping("/search")
    public ResponseEntity<?> searchGoods(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam String keyword
    ) {
        SearchResponseDto<GoodsResponseDto> goodsList = goodsService.searchGoods(page, pageSize, keyword);
        return new ResponseEntity<>(goodsList,HttpStatus.OK);
    }
}
