package com.c109.chaintoon.domain.fanart.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//팬아트 메인 dto
public class FanartResponseDto {
    private Integer fanartId;
    private Integer userId;
    private Integer webtoonId;
    private String fanartImage;
    private String fanartName;
    private String garoThumbnail;
    private String seroThumbnail;
    private String description;
    private String webtoonName;
    private String writer;
}
