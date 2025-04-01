package com.c109.chaintoon.domain.nft.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiddingHistoryResponseDto {
    private Integer sequence;
    private Integer userId;
    private Double biddingPrice;
    private String createdAt;
}
