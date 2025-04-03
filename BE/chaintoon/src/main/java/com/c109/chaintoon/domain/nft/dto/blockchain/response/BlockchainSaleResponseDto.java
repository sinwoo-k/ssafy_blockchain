package com.c109.chaintoon.domain.nft.dto.blockchain.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BlockchainSaleResponseDto {
    private String tradeId;
    private String status;
}
