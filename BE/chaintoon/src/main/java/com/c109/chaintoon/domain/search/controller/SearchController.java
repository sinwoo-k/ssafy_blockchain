package com.c109.chaintoon.domain.search.controller;

import com.c109.chaintoon.domain.search.dto.response.SearchResponseDto;
import com.c109.chaintoon.domain.search.dto.response.SearchResult;
import com.c109.chaintoon.domain.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<?> search(
            @RequestParam String type,
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        SearchResponseDto<? extends SearchResult> searchResponseDto = searchService.search(type, keyword, page, pageSize);
        return new ResponseEntity<>(searchResponseDto, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<?> searchAll(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        Map<String, SearchResponseDto<? extends SearchResult>> resultMap = searchService.searchAll(keyword, pageSize);
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
}
