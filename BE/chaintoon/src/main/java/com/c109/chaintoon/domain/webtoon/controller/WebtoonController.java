package com.c109.chaintoon.domain.webtoon.controller;

import com.c109.chaintoon.domain.webtoon.dto.request.WebtoonRequestDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonListResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.WebtoonResponseDto;
import com.c109.chaintoon.domain.webtoon.service.WebtoonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/webtoons")
public class WebtoonController {

    private final WebtoonService webtoonService;

    public WebtoonController(WebtoonService webtoonService) {
        this.webtoonService = webtoonService;
    }

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
        WebtoonResponseDto webtoon = webtoonService.addWebtoon(webtoonRequest, garoImage, seroImage);
        return new ResponseEntity<>(webtoon, HttpStatus.CREATED);
    }

    @PutMapping("/{webtoonId}")
    public ResponseEntity<?> updateWebtoon(
            @PathVariable Integer webtoonId,
            @RequestPart(value = "webtoon", required = false) WebtoonRequestDto webtoonRequest,
            @RequestPart(value = "garoImage", required = false) MultipartFile garoImage,
            @RequestPart(value = "seroImage", required = false) MultipartFile seroImage) {
        WebtoonResponseDto webtoon = webtoonService.updateWebtoon(webtoonId, webtoonRequest, garoImage, seroImage);
        return new ResponseEntity<>(webtoon, HttpStatus.OK);
    }


}
