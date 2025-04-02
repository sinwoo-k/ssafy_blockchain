package com.c109.chaintoon.domain.webtoon.dto.response;

import com.c109.chaintoon.domain.search.dto.response.SearchResult;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebtoonListResponseDto implements SearchResult {
    private Integer webtoonId;
    private Integer userId;
    private String writer;
    private String webtoonName;
    private String genre;
    private Long episodeCount;
    private Long viewCount;
    private Double rating;
    private String lastUploadDate;
    private String garoThumbnail;
    private String seroThumbnail;
}
