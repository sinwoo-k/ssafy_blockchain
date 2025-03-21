package com.c109.chaintoon.domain.webtoon.dto.response;

import lombok.*;
import java.util.List;

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
    private Double rating;
    private String garoThumbnail;
    private String seroThumbnail;
    private List<String> tags;
}
