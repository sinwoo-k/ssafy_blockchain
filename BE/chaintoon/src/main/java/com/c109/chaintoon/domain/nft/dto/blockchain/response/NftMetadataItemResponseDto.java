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
    private Boolean onSale;
    private Double salePrice;  // Gwei 단위로
}
