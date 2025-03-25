package com.c109.chaintoon.domain.sso.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "sso.ssafy")
public record SsafyConfig(
        String clientId,
        String clientSecret,
        String redirectUri,
        String authorizationUri,
        String tokenUri,
        String userInfoUri
) {
}
