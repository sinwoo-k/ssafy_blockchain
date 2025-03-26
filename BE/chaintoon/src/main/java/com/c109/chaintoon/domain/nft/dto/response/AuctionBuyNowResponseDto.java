package com.c109.chaintoon.domain.nft.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionBuyNowResponseDto {
    private Integer auctionItemId;
    private Double buyNowPrice;
    private Integer buyerId;
    private String startTime;
    private String endTime;
}
