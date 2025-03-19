package com.c109.chaintoon.domain.webtoon.controller;

import com.c109.chaintoon.domain.webtoon.dto.request.WebtoonRequestDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonListResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonResponseDto;
import com.c109.chaintoon.domain.webtoon.service.WebtoonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            @RequestParam(required = false) String genre
    ) {

        List<WebtoonListResponseDto> webtoonList = webtoonService.getWebtoonList(page, pageSize, orderBy, genre);
        return new ResponseEntity<>(webtoonList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> addWebtoon(
            @RequestPart("webtoon") WebtoonRequestDto webtoonRequest,
            @RequestPart("garoImage") MultipartFile garoImage,
            @RequestPart("seroImage") MultipartFile seroImage
    ) {
        webtoonRequest.setUserId(0); // TODO: user 구현 후 변경
        WebtoonResponseDto webtoon = webtoonService.addWebtoon(webtoonRequest, garoImage, seroImage);
        return new ResponseEntity<>(webtoon, HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchWebtoon(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam String keyword
    ) {
        List<WebtoonListResponseDto> webtoonList = webtoonService.searchWebtoon(page, pageSize, keyword);
        return new ResponseEntity<>(webtoonList, HttpStatus.OK);
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavoriteWebtoonList(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        Integer userId = 0; // TODO: user 구현 후 변경
        List<WebtoonListResponseDto> webtoonList = webtoonService.getFavoriteWebtoonList(page, pageSize, userId);
        return new ResponseEntity<>(webtoonList, HttpStatus.OK);
    }

    @GetMapping("/{webtoonId}")
    public ResponseEntity<?> getWebtoon(
            @PathVariable Integer webtoonId
    ) {
        WebtoonResponseDto webtoon = webtoonService.getWebtoon(webtoonId);
        return new ResponseEntity<>(webtoon, HttpStatus.OK);
    }

    @PatchMapping("/{webtoonId}")
    public ResponseEntity<?> updateWebtoon(
            @PathVariable Integer webtoonId,
            @RequestPart(value = "webtoon", required = false) WebtoonRequestDto webtoonRequest,
            @RequestPart(value = "garoImage", required = false) MultipartFile garoImage,
            @RequestPart(value = "seroImage", required = false) MultipartFile seroImage) {
        Integer userId = 0; // TODO: user 구현 후 변경
        WebtoonResponseDto webtoon = webtoonService.updateWebtoon(webtoonId, userId, webtoonRequest, garoImage, seroImage);
        return new ResponseEntity<>(webtoon, HttpStatus.OK);
    }

    @DeleteMapping("/{webtoonId}")
    public ResponseEntity<?> deleteWebtoon(
            @PathVariable Integer webtoonId
    ) {
        Integer userId = 0; // TODO: user 구현 후 변경
        webtoonService.deleteWebtoon(webtoonId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{webtoonId}/favorite")
    public ResponseEntity<?> addFavoriteWebtoon(
            @PathVariable Integer webtoonId
    ) {
        Integer userId = 0; // TODO: user 구현 후 변경
        webtoonService.addFavoriteWebtoon(webtoonId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{webtoonId}/favorite")
    public ResponseEntity<?> deleteFavoriteWebtoon(
            @PathVariable Integer webtoonId
    ) {
        Integer userId = 0; // TODO: user 구현 후 변경
        webtoonService.deleteFavoriteWebtoon(webtoonId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
