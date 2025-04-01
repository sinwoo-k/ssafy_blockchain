package com.c109.chaintoon.domain.search.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResponseDto<T extends SearchResult> {
    private String type;
    private Long totalCount;
    private List<T> searchResult;
}
