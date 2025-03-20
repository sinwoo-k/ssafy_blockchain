package com.c109.chaintoon.common.code;

import lombok.Getter;

public class Codes {
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

        public static NftType getByValue(String value) {
            for (NftType type : values()) {
                if (type.value.equals(value)) {
                    return type;
                }
            }
            return null;
        }
    }

    @Getter
    public enum NoticeType {
        NFT_PURCHASE("NFT 구매 완료", "NTC_NFT_PURCHASE"),
        NFT_SOLD("NFT 판매 완료", "NTC_NFT_SOLD"),
        OVERBID("상회 입찰", "NTC_OVERBID"),
        SECONDARY_CREATE("2차 창작물 생성", "NTC_SECONDARY_CREATION"),
        SECONDARY_CREATION_NFT_MINT("2차 창작물 NFT 발행", "NTC_SECONDARY_CREATION_NFT_MINT"),
        SECONDARY_CREATION_NFT_SOLD("2차 창작물 NFT 판매", "NTC_SECONDARY_CREATION_NFT_SOLD");

        private final String description;
        private final String value;

        NoticeType(String description, String value) {
            this.description = description;
            this.value = value;
        }

        public static NoticeType getByValue(String value) {
            for (NoticeType type : values()) {
                if (type.value.equals(value)) {
                    return type;
                }
            }
            return null;
        }
    }
}
