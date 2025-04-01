package com.c109.chaintoon.domain.search.code;

import lombok.Getter;

@Getter
public enum SearchType {
    WEBTOON("웹툰", "SEARCH_WEBTOON"),
    GOODS("굿즈", "SEARCH_GOODS"),
    FANART("팬아트", "SEARCH_FANART"),
    USER("유저", "SEARCH_USER");

    private final String description;
    private final String value;

    SearchType(String description, String value) {
        this.description = description;
        this.value = value;
    }
}
