package com.c109.chaintoon.domain.fanart.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//웹툰별 팬아트 ResponseDto
public class WebtoonFanartResponseDto {
    private Integer fanartId;
    private Integer userId;
    private Integer webtoonId;
    private String garoThumbnail;
    private String seroThumbnail;
    private String webtoonName;
    private String writer;
    private String genre;
    private String summary;
    private Integer webtoonFanartCount;
    private List<String> fanartImages;
}
