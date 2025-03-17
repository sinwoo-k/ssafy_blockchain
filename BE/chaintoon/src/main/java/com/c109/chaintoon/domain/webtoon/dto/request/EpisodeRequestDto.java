package com.c109.chaintoon.domain.webtoon.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EpisodeRequestDto {
    private Integer episodeId;
    private Integer webtoonId;
    private String episodeName;
    private String writerComment;
    private String commentable;
}
