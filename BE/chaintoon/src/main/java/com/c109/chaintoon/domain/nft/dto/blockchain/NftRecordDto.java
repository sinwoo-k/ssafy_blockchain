package com.c109.chaintoon.domain.nft.dto.blockchain;

import lombok.*;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class NftRecordDto {
    private Integer webtoonId;       // 웹툰 ID
    private Integer tokenId;         // 민팅된 토큰 ID
    private String title;            // 메타데이터 Title
    private Integer userId;          // 사용자 ID
    private String type;             // NFT 타입 ("fanart", "goods", "episode")
    private Integer typeId;          // 실제 아이템 ID
    private String contractAddress;  // 스마트컨트랙트 주소 (예: NFT_MARKETPLACE_ADDRESS)
    private String imageUrl;         // Pinata에 업로드된 이미지 URL
    private String metadataUri;      // Pinata에 업로드된 메타데이터 URL
}