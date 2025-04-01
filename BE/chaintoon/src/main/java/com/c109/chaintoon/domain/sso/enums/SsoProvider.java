package com.c109.chaintoon.domain.sso.enums;

import java.util.Arrays;

public enum SsoProvider {
    SSAFY,
    CHAINTOON;

    public static SsoProvider fromType(String type) {
        return Arrays.stream(SsoProvider.values())
                .filter(provider -> provider.name().equalsIgnoreCase(type))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(type + " is not a valid provider"));
    }
}
