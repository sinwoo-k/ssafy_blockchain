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
    private String startTime; // 경매 시작 시간
    private String endTime; // 경매 종료 시간
}
