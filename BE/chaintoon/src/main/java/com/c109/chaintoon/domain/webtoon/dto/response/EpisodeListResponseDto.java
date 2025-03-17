package com.c109.chaintoon.domain.webtoon.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EpisodeListResponseDto {
    private Integer episodeId;
    private Integer webtoonId;
    private String episodeName;
    private String uploadDate;
    private Long commentCount;
    private Double rating;
}
