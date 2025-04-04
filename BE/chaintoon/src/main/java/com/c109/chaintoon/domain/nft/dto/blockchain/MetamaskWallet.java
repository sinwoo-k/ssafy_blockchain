package com.c109.chaintoon.domain.nft.dto.blockchain;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetamaskWallet {
    private String walletAddress;
    private String signature;
    private String message;
}
