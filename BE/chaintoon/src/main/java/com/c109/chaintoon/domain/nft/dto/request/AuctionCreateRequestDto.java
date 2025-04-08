package com.c109.chaintoon.domain.nft.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionCreateRequestDto {
    @Positive(message = "NFT ID는 음수일 수 없습니다.")
    private Integer nftId;

    @DecimalMin(value = "1E-5", message = "최소 입찰가는 0.00001 ETH 이상을 입력하세요.")
    private Double minimumBidPrice; // 최소 입찰가

    @DecimalMin(value = "1E-5", message = "즉시 구매가는 0.00001 ETH 이상을 입력하세요.")
    private Double buyNowPrice; // 즉시 구매가

    @Future(message = "경매 종료시간은 미래 시간을 입력하세요.")
    private LocalDateTime endTime; // 경매 종료 시점
}
