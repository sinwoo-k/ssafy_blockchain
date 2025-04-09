package com.c109.chaintoon.domain.nft.dto.blockchain.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockchainBuyResponseDto {
    private String message;
    private String tokenId;

    private String buyer;                 // 지갑 주소
    private String seller;               // 지갑 주소
    private String originalCreator;      // 지갑 주소
    private String prevOwner;            // 지갑 주소

    private String soldPriceEther;
    private String originalCreatorShareEther;
    private String prevOwnerShareEther;

}

