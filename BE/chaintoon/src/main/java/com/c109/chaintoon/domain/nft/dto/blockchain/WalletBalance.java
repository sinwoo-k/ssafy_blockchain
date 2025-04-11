package com.c109.chaintoon.domain.nft.dto.blockchain;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletBalance {
    private String walletAddress;
    private Double amount;
}
