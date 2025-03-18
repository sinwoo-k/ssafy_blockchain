package com.c109.chaintoon.domain.webtoon.controller;

import com.c109.chaintoon.domain.webtoon.dto.request.FanartRequestDto;
import com.c109.chaintoon.domain.webtoon.dto.response.FanartDetailResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.FanartResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonFanartResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonListResponseDto;
import com.c109.chaintoon.domain.webtoon.entity.Fanart;
import com.c109.chaintoon.domain.webtoon.service.FanartService;
import lombok.RequiredArgsConstructor;
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
    public List<FanartResponseDto> getLatestSevenFanarts(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "7") int pageSize,
            @RequestParam(required = false, defaultValue = "latest") String orderBy
    ) {
        return fanartService.getLatestSevenFanarts(page, pageSize, orderBy);
    }

    //1-2. 웹툰별 팬아트 목록 조회
    @GetMapping("/webtoon-list")
    public List<WebtoonListResponseDto> getWebtoonGrid(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "latest") String orderBy) {
        return fanartService.getWebtoonGrid(page, orderBy);
    }

    // 웹툰별 팬아트 목록 조회
    @GetMapping("webtoons/{webtoonId}")
    public WebtoonFanartResponseDto getFanartByWebtoon(
            @PathVariable Integer webtoonId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "latest") String orderBy
    ) {
        return fanartService.getFanartByWebtoon(webtoonId, page, pageSize, orderBy);
    }

    // 팬아트 등록
    @PostMapping
    public WebtoonFanartResponseDto createFanart(
            @RequestBody FanartRequestDto fanartRequestDto
    ) {
        return fanartService.createFanart(fanartRequestDto);
    }

    // 팬아트 상세 조회
    @GetMapping("/{fanartId}")
    public FanartDetailResponseDto getFanartDetail(
            @PathVariable Integer fanartId) {
        return fanartService.getFanartDetail(fanartId);
    }

    // 내 팬아트 목록 조회
    @GetMapping("/my-fanart")
    public List<FanartResponseDto> getMyFanaartList(
            @RequestParam Integer userId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "latest") String orderBy) {
        return fanartService.getMyFanartList(userId, page, pageSize, orderBy);
    }
    // 팬아트 수정
    @PatchMapping("/{fanartId}")
    public FanartResponseDto updateFanart(
            @PathVariable Integer fanartId,
            @RequestPart("fanartRequest") FanartRequestDto fanartRequestDto,
            @RequestPart(value = "fanartImage", required = false) MultipartFile fanartImage) {
        fanartRequestDto.setFanartId(fanartId);
        return fanartService.updateFanart(fanartRequestDto, fanartImage);
    }

    // 팬아트 삭제
    @DeleteMapping("/{fanartId}")
    public List<FanartResponseDto> deleteFanart(
            @PathVariable Integer fanartId,
            @RequestParam Integer userId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "latest") String orderBy) {
        return fanartService.deleteFanart(fanartId, userId, page, pageSize, orderBy);
    }
}
