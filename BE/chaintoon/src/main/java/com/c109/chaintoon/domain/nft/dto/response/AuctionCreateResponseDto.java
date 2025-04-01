package com.c109.chaintoon.domain.nft.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionCreateResponseDto {
    private Integer auctionItemId;
    private Integer nftId;
    private String type;
    private Double biddingPrice;
    private Double buyNowPrice;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String ended; // 경매 종료 여부 - 초기값 "N"
    private String success; // 경매 성공 여부 - 초기값 "N"
    private LocalDateTime createdAt;
    private String blockchainStatus;
}
