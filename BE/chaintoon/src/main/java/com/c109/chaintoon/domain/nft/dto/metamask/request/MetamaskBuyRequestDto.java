package com.c109.chaintoon.domain.nft.dto.metamask.request;

import lombok.*;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class MetamaskBuyRequestDto {
    private Integer tokenId;
    private String price;
    private Integer userId;
}
