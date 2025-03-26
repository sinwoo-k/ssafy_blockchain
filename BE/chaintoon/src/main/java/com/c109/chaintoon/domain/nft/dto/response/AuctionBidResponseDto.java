package com.c109.chaintoon.domain.nft.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionBidResponseDto {
    private Integer auctionItemId;
    private Integer bidderId;
    private Double biddingPrice;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
