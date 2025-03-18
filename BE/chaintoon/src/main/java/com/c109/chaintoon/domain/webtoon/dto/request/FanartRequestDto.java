package com.c109.chaintoon.domain.webtoon.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FanartRequestDto {
    private Integer fanartId;
    private Integer userId;
    private Integer webtoonId;
    private String webtoonName;
    private String fanartName;
    private String description;
    private String fanartImage;
}
