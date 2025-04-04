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
    BLOCKCHAIN_NETWORK_SUCCESS("블록체인 네트워크 성공", "NTC_BLOCKCHAIN_NETWORK_SUCCESS"),
    BLOCKCHAIN_NETWORK_FAIL("블록체인 네트워크 실패", "NTC_BLOCKCHAIN_NETWORK_FAIL");


    private final String description;
    private final String value;

    NoticeType(String description, String value) {
        this.description = description;
        this.value = value;
    }
}