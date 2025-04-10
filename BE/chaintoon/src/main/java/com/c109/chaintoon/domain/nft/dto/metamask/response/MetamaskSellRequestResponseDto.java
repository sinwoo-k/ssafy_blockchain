package com.c109.chaintoon.domain.nft.dto.metamask.response;

import lombok.*;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class MetamaskSellRequestResponseDto {
    private boolean needSignature;
    private String messageToSign;
    private Integer auctionItemId;
}