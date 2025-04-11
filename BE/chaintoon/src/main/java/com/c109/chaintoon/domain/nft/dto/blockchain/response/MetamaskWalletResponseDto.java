package com.c109.chaintoon.domain.nft.dto.blockchain.response;

import com.c109.chaintoon.domain.user.dto.response.UserResponseDto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetamaskWalletResponseDto {
    private String walletAddress;
    private Integer userId;
}
