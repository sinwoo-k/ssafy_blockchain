package com.c109.chaintoon.domain.webtoon.controller;

import com.c109.chaintoon.domain.webtoon.dto.request.EpisodeRequestDto;
import com.c109.chaintoon.domain.webtoon.dto.response.EpisodeListResponseDto;
import com.c109.chaintoon.domain.webtoon.dto.response.EpisodeResponseDto;
import com.c109.chaintoon.domain.webtoon.service.EpisodeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/episodes")
public class EpisodeController {

    private final EpisodeService episodeService;

    public EpisodeController(EpisodeService episodeService) {
        this.episodeService = episodeService;
    }

    @GetMapping
    public ResponseEntity<?> getEpisodeList(
            @RequestParam int webtoonId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        List<EpisodeListResponseDto> episodeList = episodeService.getEpisodeList(webtoonId, page, pageSize);
        return new ResponseEntity<>(episodeList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> addEpisode(
            @RequestPart(name = "episode") EpisodeRequestDto episodeRequest,
            @RequestPart(name = "thumbnail") MultipartFile thumbnail,
            @RequestPart(name = "images") List<MultipartFile> images
    ) {
        EpisodeResponseDto episode = episodeService.addEpisode(episodeRequest, thumbnail, images);
        return new ResponseEntity<>(episode, HttpStatus.CREATED);
    }

    @GetMapping("/{episodeId}")
    public ResponseEntity<?> getEpisode(@PathVariable Integer episodeId) {
        EpisodeResponseDto episode = episodeService.getEpisode(episodeId);
        return new ResponseEntity<>(episode, HttpStatus.OK);
    }

    @GetMapping("/first")
    public ResponseEntity<?> getFirstEpisode(@RequestParam int webtoonId) {
        EpisodeResponseDto episode = episodeService.getFirstEpisode(webtoonId);
        return new ResponseEntity<>(episode, HttpStatus.OK);
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestEpisode(@RequestParam int webtoonId) {
        EpisodeResponseDto episode = episodeService.getLatestEpisode(webtoonId);
        return new ResponseEntity<>(episode, HttpStatus.OK);
    }

    @PatchMapping("/{episodeId}")
    public ResponseEntity<?> updateEpisode(
            @RequestPart(name = "episode", required = false) EpisodeRequestDto episodeRequest,
            @RequestPart(name = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(name = "images", required = false) List<MultipartFile> images
    ) {
        EpisodeResponseDto episode = episodeService.updateEpisode();
        return new ResponseEntity<>(episode, HttpStatus.OK);
    }

}
