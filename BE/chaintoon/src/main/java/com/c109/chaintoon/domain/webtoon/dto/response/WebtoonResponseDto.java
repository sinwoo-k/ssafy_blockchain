package com.c109.chaintoon.domain.webtoon.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebtoonResponseDto {
    private Integer webtoonId;
    private Integer userId;
    private String writer;
    private String webtoonName;
    private String genre;
    private String summary;
    private String adaptable;
    private Long episodeCount;
    private Long viewCount;
    private String garoThumbnail;
    private String seroThumbnail;
}
