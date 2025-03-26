package com.c109.chaintoon.domain.nft.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionCreateRequestDto {
    private Integer nftId;
    private Double minimumBidPrice; // 최소 입찰가
    private Double buyNowPrice; // 즉시 구매가
    private LocalDateTime endTime; // 경매 종료 시점
}
