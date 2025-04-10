package com.c109.chaintoon.domain.nft.dto.metamask.request;

import lombok.*;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class MetamaskSignatureRequestDto {
    private Integer userId;
    private String signature;
}