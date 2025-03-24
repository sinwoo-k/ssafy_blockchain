package com.c109.chaintoon.domain.nft.code;

import lombok.Getter;

@Getter
public enum NftType {
    EPISODE("에피소드", "NFT_EPISODE"),
    FANART("팬아트", "NFT_FANART"),
    GOODS("굿즈", "NFT_GOODS"),;

    private final String description;
    private final String value;

    NftType(String description, String value) {
        this.description = description;
        this.value = value;
    }
}