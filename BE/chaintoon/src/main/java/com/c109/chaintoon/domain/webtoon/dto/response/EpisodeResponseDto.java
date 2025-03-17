package com.c109.chaintoon.domain.webtoon.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EpisodeResponseDto {
    private Integer episodeId;
    private Integer webtoonId;
    private String episodeName;
    private String writerComment;
    private String commentable;
    private String uploadDate;
    private String thumbnail;
    private Long commentCount;
    private Double rating;
    private Integer previousEpisodeId;
    private Integer nextEpisodeId;
    private List<String> images;
}
