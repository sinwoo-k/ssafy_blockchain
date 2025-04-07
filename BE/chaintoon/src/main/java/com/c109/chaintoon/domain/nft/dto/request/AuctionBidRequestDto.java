package com.c109.chaintoon.domain.nft.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionBidRequestDto {
    @Positive(message = "경매장 아이템 ID는 음수일 수 없습니다.")
    private Integer auctionItemId;

    @DecimalMin(value = "1E-9", message = "입찰가는 1 gwei 이상을 입력하세요.")
    private Double  biddingPrice;
}
