package com.c109.chaintoon.domain.user.code;

import lombok.Getter;

@Getter
public enum NoticeType {
    NFT_PURCHASE("NFT 구매 완료", "NTC_NFT_PURCHASE"),
    NFT_SOLD("NFT 판매 완료", "NTC_NFT_SOLD"),
    OVERBID("상회 입찰", "NTC_OVERBID"),
    SECONDARY_CREATE("2차 창작물 생성", "NTC_SECONDARY_CREATION"),
    SECONDARY_CREATION_NFT_MINT("2차 창작물 NFT 발행", "NTC_SECONDARY_CREATION_NFT_MINT"),
    SECONDARY_CREATION_NFT_SOLD("2차 창작물 NFT 판매", "NTC_SECONDARY_CREATION_NFT_SOLD"),
    WALLET_CREATE("지갑 생성 완료", "NTC_WALLET_CREATION"),
    CREATION_NFT_MINT("NFT 발행 완료", "NTC_CREATION_NFT_MINT"),
    WALLET_FAIL("지갑 생성 실패", "NTC_WALLET_FAIL"),
    CREATION_NFT_MINT_FAIL("NFT 발행 실패", "NTC_CREATION_NFT_MINT_FAIL");


    private final String description;
    private final String value;

    NoticeType(String description, String value) {
        this.description = description;
        this.value = value;
    }
}