package com.c109.chaintoon.domain.webtoon.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

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
    private List<String> tags;
}
