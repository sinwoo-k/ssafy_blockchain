package com.c109.chaintoon.domain.user.dto.response;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActiveTradingResponseDto {
    private Integer auctionItemId;
    private Integer nftId;
    private String itemImage;
    private String webtoonName;
    private Double currentBiddingPrice;
    private Double buyNowPrice;
    private String startTime;
    private String endTime;
}
