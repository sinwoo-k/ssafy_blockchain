package com.c109.chaintoon.domain.nft.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionBuyNowRequestDto {
    @Positive(message = "경매장 아이템 ID는 음수일 수 없습니다.")
    private Integer auctionItemId;
}
