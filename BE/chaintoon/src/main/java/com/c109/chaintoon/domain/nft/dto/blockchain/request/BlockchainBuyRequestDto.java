package com.c109.chaintoon.domain.nft.dto.blockchain.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockchainBuyRequestDto {
    private Integer tokenId;
    private Double price;
    private Integer userId;
}
