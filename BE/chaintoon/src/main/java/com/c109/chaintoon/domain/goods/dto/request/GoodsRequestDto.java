package com.c109.chaintoon.domain.goods.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoodsRequestDto {
    private Integer goodsId;
    private Integer userId;
    private Integer webtoonId;
    private String webtoonName;
    private String goodsName;
    private String goodsImage;
}
