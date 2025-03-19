package com.c109.chaintoon.domain.goods.dto.response;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodsListResponseDto {
    private Integer goodsId;
    private Integer userId;
    private Integer webtoonId;
    private String goodsName;
    private String goodsImage;
}
