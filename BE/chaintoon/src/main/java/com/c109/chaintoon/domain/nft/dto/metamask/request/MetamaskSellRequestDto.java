package com.c109.chaintoon.domain.nft.dto.metamask.request;

import lombok.*;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class MetamaskSellRequestDto {
    private Integer tokenId;
    private String price;   // "0.1" 처럼 문자열로
    private Integer userId;
}
