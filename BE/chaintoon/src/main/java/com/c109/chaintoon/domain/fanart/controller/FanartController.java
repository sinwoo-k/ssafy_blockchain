package com.c109.chaintoon.domain.fanart.controller;

import com.c109.chaintoon.domain.fanart.dto.request.FanartRequestDto;
import com.c109.chaintoon.domain.fanart.dto.response.FanartDetailResponseDto;
import com.c109.chaintoon.domain.fanart.dto.response.FanartResponseDto;
import com.c109.chaintoon.domain.fanart.dto.response.WebtoonFanartResponseDto;
import com.c109.chaintoon.domain.fanart.entity.Fanart;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonListResponseDto;
import com.c109.chaintoon.domain.fanart.service.FanartService;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<FanartResponseDto>> getLatestSevenFanarts(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "7") int pageSize,
            @RequestParam(required = false, defaultValue = "latest") String orderBy
    ) {
        List<FanartResponseDto> response = fanartService.getLatestSevenFanarts(page, pageSize, orderBy);
        return ResponseEntity.ok(response);
    }

    //1-2. 웹툰별 팬아트 목록 조회
    @GetMapping("/webtoon-list")
    public ResponseEntity<List<WebtoonListResponseDto>> getWebtoonGrid(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "latest") String orderBy) {
        List<WebtoonListResponseDto> response = fanartService.getWebtoonGrid(page, orderBy);
        return ResponseEntity.ok(response);
    }

    // 특정 웹툰의 모든 팬아트 조회
    @GetMapping("webtoons/{webtoonId}")
    public ResponseEntity<WebtoonFanartResponseDto> getFanartByWebtoon(
            @PathVariable Integer webtoonId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "latest") String orderBy
    ) {
        WebtoonFanartResponseDto response = fanartService.getFanartByWebtoon(webtoonId, page, pageSize, orderBy);
        return ResponseEntity.ok(response);
    }

    // 팬아트 등록
    @PostMapping
    public ResponseEntity<FanartDetailResponseDto> createFanart(
            @RequestPart("fanart") FanartRequestDto fanartRequestDto,
            @RequestPart("fanartImage") MultipartFile fanartImage
    ) {
        FanartDetailResponseDto response = fanartService.createFanart(fanartRequestDto, fanartImage);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 팬아트 상세 조회
    @GetMapping("/{fanartId}")
    public ResponseEntity<FanartDetailResponseDto> getFanartDetail(
            @PathVariable Integer fanartId) {
        FanartDetailResponseDto response = fanartService.getFanartDetail(fanartId);
        return ResponseEntity.ok(response);
    }

    // 내 팬아트 목록 조회
    @GetMapping("/my-fanart")
    public ResponseEntity<List<FanartResponseDto>> getMyFanaartList(
            @RequestParam Integer userId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "latest") String orderBy) {
        List<FanartResponseDto> response = fanartService.getMyFanartList(userId, page, pageSize, orderBy);
        return ResponseEntity.ok(response);
    }

    // 팬아트 수정
    @PatchMapping("/{fanartId}")
    public ResponseEntity<FanartDetailResponseDto> updateFanart(
            @PathVariable Integer fanartId,
            @RequestPart("fanart") FanartRequestDto fanartRequestDto,
            @RequestPart(value = "fanartImage", required = false) MultipartFile fanartImage) {
        fanartRequestDto.setFanartId(fanartId);
        FanartDetailResponseDto response = fanartService.updateFanart(fanartRequestDto, fanartImage);
        return ResponseEntity.ok(response);
    }

    // 팬아트 삭제
    @DeleteMapping("/{fanartId}")
    public ResponseEntity<Void> deleteFanart(
            @PathVariable Integer fanartId,
            @RequestParam Integer userId) {
        fanartService.deleteFanart(fanartId, userId);
        return ResponseEntity.noContent().build();
    }

    // 팬아트 검색
    @GetMapping("/search")
    public ResponseEntity<?> searchFanart(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam String keyword
    ) {
        List<FanartDetailResponseDto> fanartList = fanartService.searchFanarts(page, pageSize, keyword);
        return new ResponseEntity<>(fanartList, HttpStatus.OK);
    }

    // 좋아요 추가
    @PostMapping("/{fanartId}/like")
    public ResponseEntity<?> likeFanart(
            @PathVariable Integer fanartId,
            @RequestParam Integer userId
    ) {
        fanartService.likeFanart(fanartId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 좋아요 취소
    @DeleteMapping("/{fanartId}/like")
    public ResponseEntity<?> unlikeFanart(
            @PathVariable Integer fanartId,
            @RequestParam Integer userId
    ) {
        fanartService.unlikeFanart(fanartId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
