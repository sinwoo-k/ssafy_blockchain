package com.c109.chaintoon.domain.fanart.controller;

import com.c109.chaintoon.domain.fanart.dto.request.FanartRequestDto;
import com.c109.chaintoon.domain.fanart.dto.response.FanartResponseDto;
import com.c109.chaintoon.domain.fanart.dto.response.FanartListResponseDto;
import com.c109.chaintoon.domain.fanart.service.FanartService;
import com.c109.chaintoon.domain.search.dto.response.SearchResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/fanarts")
@RequiredArgsConstructor
public class FanartController {

    private final FanartService fanartService;

    // 1. 팬아트 메인 목록 조회
    // 1-1. 가장 최근에 등록된 팬아트 7개 조회
    @GetMapping("/latest")
    public ResponseEntity<List<FanartListResponseDto>> getLatestSevenFanarts(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "7") int pageSize,
            @RequestParam(required = false, defaultValue = "latest") String orderBy
    ) {
        List<FanartListResponseDto> response = fanartService.getLatestSevenFanarts(page, pageSize, orderBy);
        return ResponseEntity.ok(response);
    }

    // 특정 웹툰의 모든 팬아트 조회
    @GetMapping("webtoons/{webtoonId}")
    public ResponseEntity<List<FanartListResponseDto>> getFanartByWebtoon(
            @PathVariable Integer webtoonId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "latest") String orderBy
    ) {
        List<FanartListResponseDto> response = fanartService.getFanartByWebtoon(webtoonId, page, pageSize, orderBy);
        return ResponseEntity.ok(response);
    }

    // 팬아트 등록
    @PostMapping
    public ResponseEntity<FanartResponseDto> createFanart(
            @AuthenticationPrincipal Integer userId,
            @Valid @RequestPart("fanart") FanartRequestDto fanartRequestDto,
            @RequestPart("fanartImage") MultipartFile fanartImage
    ) {
        FanartResponseDto response = fanartService.createFanart(userId, fanartRequestDto, fanartImage);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 팬아트 상세 조회
    @GetMapping("/{fanartId}")
    public ResponseEntity<FanartResponseDto> getFanartDetail(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer fanartId
    ) {
        FanartResponseDto response = fanartService.getFanartDetail(userId, fanartId);
        return ResponseEntity.ok(response);
    }

    // 내 팬아트 목록 조회
    @GetMapping("/my-fanart")
    public ResponseEntity<List<FanartListResponseDto>> getMyFanaartList(
            @AuthenticationPrincipal Integer userId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "latest") String orderBy) {
        List<FanartListResponseDto> response = fanartService.getMyFanartList(userId, page, pageSize, orderBy);
        return ResponseEntity.ok(response);
    }

    // 팬아트 수정
    @PatchMapping("/{fanartId}")
    public ResponseEntity<FanartResponseDto> updateFanart(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer fanartId,
            @Valid @RequestPart("fanart") FanartRequestDto fanartRequestDto,
            @RequestPart(value = "fanartImage", required = false) MultipartFile fanartImage) {
        FanartResponseDto response = fanartService.updateFanart(userId, fanartId, fanartRequestDto, fanartImage);
        return ResponseEntity.ok(response);
    }

    // 팬아트 삭제
    @DeleteMapping("/{fanartId}")
    public ResponseEntity<?> deleteFanart(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer fanartId
    ) {
        fanartService.deleteFanart(fanartId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 팬아트 검색
    @GetMapping("/search")
    public ResponseEntity<?> searchFanart(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam String keyword
    ) {
        SearchResponseDto<FanartListResponseDto> fanartList = fanartService.searchFanarts(page, pageSize, keyword);
        return new ResponseEntity<>(fanartList, HttpStatus.OK);
    }

    // 좋아요 추가
    @PostMapping("/{fanartId}/like")
    public ResponseEntity<?> likeFanart(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer fanartId
    ) {
        fanartService.likeFanart(userId, fanartId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 좋아요 취소
    @DeleteMapping("/{fanartId}/like")
    public ResponseEntity<?> unlikeFanart(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer fanartId
    ) {
        fanartService.unlikeFanart(userId, fanartId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
