package com.c109.chaintoon.domain.webtoon.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class PaginatedWebtoonListResponse {
    private long totalItems;
    private int totalPages;
    private int currentPage;
    private List<WebtoonListResponseDto> webtoons;
}