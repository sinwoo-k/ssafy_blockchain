package com.c109.chaintoon.domain.fanart.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//팬아트 상세 ResponseDto
public class FanartDetailResponseDto {
    private Integer fanartId;
    private Integer userId;
    private Integer webtoonId;
    private String fanartImage;
    private String fanartName;
    private String webtoonName;
    private String userNickname;
    private String description;
}
