package com.c109.chaintoon.domain.nft.dto.blockchain;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NftMetadata {
    private Integer tokenId;
    private String title;
    private String description;
    private String image;
    private Wallets wallets;
    private RevenueDistribution revenueDistribution;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Wallets {
        private String originalCreator;
        private String owner;
        private String adminWallet;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RevenueDistribution {
        private String originalCreator;
        private String owner;
        private String adminWallet;
    }
}
