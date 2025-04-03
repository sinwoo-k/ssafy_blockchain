package com.c109.chaintoon.domain.nft.dto.blockchain.item;

import com.c109.chaintoon.domain.nft.dto.blockchain.NftMetadata;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NftMetadataItem {
    private Integer tokenId;
    private String tokenURI;
    private NftMetadata metadata;
}
