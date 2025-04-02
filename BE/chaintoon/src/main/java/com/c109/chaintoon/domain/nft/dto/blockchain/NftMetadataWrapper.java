package com.c109.chaintoon.domain.nft.dto.blockchain;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NftMetadataWrapper {
    private String status;
    private NftMetadata data;
}
