package com.c109.chaintoon.domain.webtoon.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebtoonListResponseDto {
    private Integer webtoonId;
    private Integer userId;
    private String writer;
    private String webtoonName;
    private String genre;
    private String garoThumbnail;
    private String seroThumbnail;
    private Long episodeCount;
    private Long viewCount;
    private Double rating;
}
