package com.c109.chaintoon.domain.goods.dto.response;

import com.c109.chaintoon.domain.search.dto.response.SearchResult;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodsResponseDto implements SearchResult {
    private Integer goodsId;
    private Integer userId;
    private Integer webtoonId;
    private String goodsName;
    private String goodsImage;
}
