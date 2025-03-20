package com.c109.chaintoon.domain.goods.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebtoonGoodsResponseDto {
    private Integer goodsId;
    private Integer userId;
    private Integer webtoonId;
    private String webtoonName;
    private String writer;
    private String genre;
    private String description;
    private String garoThumbnail;
    private String seroThumbnail;
    private Integer totalGoodsCount;
    private List<GoodsListResponseDto> goodsList;
}
