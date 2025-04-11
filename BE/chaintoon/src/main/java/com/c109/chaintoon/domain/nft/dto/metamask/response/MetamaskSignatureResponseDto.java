package com.c109.chaintoon.domain.nft.dto.metamask.response;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class MetamaskSignatureResponseDto {
    private boolean success;
    private String message;
    private String operation;
    private String contractAddress; // could be null
    private Map<String, Object> metamaskPayload; // could be null
    private String imageUrl;
    private String metadataUri;
    private String title;
}
