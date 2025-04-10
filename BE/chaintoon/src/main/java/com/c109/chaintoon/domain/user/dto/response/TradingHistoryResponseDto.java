package com.c109.chaintoon.domain.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TradingHistoryResponseDto {
    private Integer auctionItemId;
    private Integer nftId;
    private String itemImage;
    private String webtoonName;
    private Double tradingValue;
    private String tradingDate;
    private String tradingTime;
    private Integer otherPartyId; // 판매내역 : 구매자 정보, 구매내역 : 판매자 정보
    private String otherPartyName;
    private String tradeType; // '판매한 것'인지 '구매한 것'인지 '거래중인 것'인지
}
