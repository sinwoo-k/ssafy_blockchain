package com.c109.chaintoon.domain.nft.dto.blockchain;

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