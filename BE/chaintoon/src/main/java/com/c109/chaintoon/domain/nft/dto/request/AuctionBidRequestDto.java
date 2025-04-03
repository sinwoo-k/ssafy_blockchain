package com.c109.chaintoon.domain.nft.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionBidRequestDto {
    private Integer auctionItemId;
    private Integer bidderId;
    private Double  biddingPrice;
}
