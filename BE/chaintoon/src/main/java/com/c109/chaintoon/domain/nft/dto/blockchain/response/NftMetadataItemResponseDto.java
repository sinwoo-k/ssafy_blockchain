package com.c109.chaintoon.domain.nft.dto.blockchain.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NftMetadataItemResponseDto {
    private Integer nftId;
    private String title;
    private String description;
    private String image;
    private String originalCreatorWallet;
    private Integer originalCreatorUserId;
    private String ownerWallet;
    private Integer ownerWalletUserId;
    private Boolean onSale;
    private Double salePrice;  // Gwei 단위로
}
