package com.c109.chaintoon.domain.webtoon.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WebtoonRequestDto {
    private Integer webtoonId;
    private Integer userId;
    private String webtoonName;
    private String genre;
    private String summary;
    private String adaptable;
}
