package com.c109.chaintoon.domain.nft.dto.blockchain.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NftMetadataResponseDto {
    Integer nftId;
    String title;
    String description;
    String image;
    String originalCreatorWallet;
    Integer originalCreatorUserId;
    String ownerWallet;
    Integer ownerWalletUserId;
    String contractAddress;
}
