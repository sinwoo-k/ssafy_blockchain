package com.c109.chaintoon.domain.webtoon.controller;

import com.c109.chaintoon.domain.search.dto.response.SearchResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.request.WebtoonRequestDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonListResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonResponseDto;
import com.c109.chaintoon.domain.webtoon.service.WebtoonService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/webtoons")
public class WebtoonController {

    private final WebtoonService webtoonService;

    @GetMapping
    public ResponseEntity<?> getWebtoonList(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "latest") String orderBy,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) @Pattern (regexp = "[YN]", message = "2차 창작 여부는 Y/N으로 입력하세요.") String adaptable
    ) {
        List<WebtoonListResponseDto> webtoonList = webtoonService.getWebtoonList(page, pageSize, orderBy, genre, adaptable);
        return new ResponseEntity<>(webtoonList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> addWebtoon(
            @AuthenticationPrincipal Integer userId,
            @Valid @RequestPart("webtoon") WebtoonRequestDto webtoonRequest,
            @RequestPart("garoImage") MultipartFile garoImage,
            @RequestPart("seroImage") MultipartFile seroImage
    ) {
        WebtoonResponseDto webtoon = webtoonService.addWebtoon(userId, webtoonRequest, garoImage, seroImage);
        return new ResponseEntity<>(webtoon, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyWebtoonList(
            @AuthenticationPrincipal Integer userId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        List<WebtoonListResponseDto> webtoonList = webtoonService.getMyWebtoonList(userId, page, pageSize);
        return new ResponseEntity<>(webtoonList, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchWebtoon(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam String keyword
    ) {
        SearchResponseDto<WebtoonListResponseDto> searchResponseDto = webtoonService.searchWebtoon(page, pageSize, keyword);
        return new ResponseEntity<>(searchResponseDto, HttpStatus.OK);
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavoriteWebtoonList(
            @AuthenticationPrincipal Integer userId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        List<WebtoonListResponseDto> webtoonList = webtoonService.getFavoriteWebtoonList(page, pageSize, userId);
        return new ResponseEntity<>(webtoonList, HttpStatus.OK);
    }

    @GetMapping("/{webtoonId}")
    public ResponseEntity<?> getWebtoon(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer webtoonId
    ) {
        WebtoonResponseDto webtoon = webtoonService.getWebtoon(userId, webtoonId);
        return new ResponseEntity<>(webtoon, HttpStatus.OK);
    }

    @PatchMapping("/{webtoonId}")
    public ResponseEntity<?> updateWebtoon(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer webtoonId,
            @Valid @RequestPart(value = "webtoon", required = false) WebtoonRequestDto webtoonRequest,
            @RequestPart(value = "garoImage", required = false) MultipartFile garoImage,
            @RequestPart(value = "seroImage", required = false) MultipartFile seroImage) {
        WebtoonResponseDto webtoon = webtoonService.updateWebtoon(webtoonId, userId, webtoonRequest, garoImage, seroImage);
        return new ResponseEntity<>(webtoon, HttpStatus.OK);
    }

    @DeleteMapping("/{webtoonId}")
    public ResponseEntity<?> deleteWebtoon(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer webtoonId
    ) {
        webtoonService.deleteWebtoon(webtoonId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{webtoonId}/favorite")
    public ResponseEntity<?> addFavoriteWebtoon(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer webtoonId
    ) {
        webtoonService.addFavoriteWebtoon(webtoonId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{webtoonId}/favorite")
    public ResponseEntity<?> deleteFavoriteWebtoon(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer webtoonId
    ) {
        webtoonService.deleteFavoriteWebtoon(webtoonId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
