package com.c109.chaintoon.domain.fanart.dto.response;

import com.c109.chaintoon.domain.search.dto.response.SearchResult;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//웹툰별 팬아트 ResponseDto
public class FanartListResponseDto implements SearchResult {
    private Integer fanartId;
    private Integer webtoonId;
    private String fanartName;
    private String fanartImage;
}
