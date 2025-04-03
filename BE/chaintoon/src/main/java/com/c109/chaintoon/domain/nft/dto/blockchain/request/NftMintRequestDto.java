package com.c109.chaintoon.domain.nft.dto.blockchain.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NftMintRequestDto {
    private Integer webtoonId;
    /** NFT 타입 (예: episode 등) */
    private String type;
    /** 타입에 해당하는 ID (예: 에피소드 번호) */
    private Integer typeId;
    private String s3Url;
}