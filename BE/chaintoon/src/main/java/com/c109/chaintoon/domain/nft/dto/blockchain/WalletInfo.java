package com.c109.chaintoon.domain.nft.dto.blockchain;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletInfo {
    private Integer walletId;
    private String walletAddress;
    private String publicKey;
    private boolean isRegistered;
    private String contractPublicKey;
    private Map<String, String> balances;
}
