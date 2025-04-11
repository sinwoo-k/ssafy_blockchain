package com.c109.chaintoon.domain.nft.dto.blockchain.wrapper;

import com.c109.chaintoon.domain.nft.dto.blockchain.item.NftMetadataItem;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NftMetadataListWrapper {
    private String status;
    private List<NftMetadataItem> data;
}