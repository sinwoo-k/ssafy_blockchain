package com.c109.chaintoon.domain.goods.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodsResponseDto {
    private Integer goodsId;
    private Integer userId;
    private Integer webtoonId;
    private String goodsName;
    private String goodsImage;
}
