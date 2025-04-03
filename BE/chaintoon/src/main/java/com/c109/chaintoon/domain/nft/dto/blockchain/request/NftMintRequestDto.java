package com.c109.chaintoon.domain.nft.dto.blockchain.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NftMintRequestDto {
    @Positive(message = "올바른 웹툰 아이디값을 입력해주세요.")
    private Integer webtoonId;
    /** NFT 타입 (예: episode 등) */
    @Pattern(regexp = "episode|fanart|goods",message = "episode, fanart, goods 로만 입력해주세요")
    private String type;
    /** 타입에 해당하는 ID (예: 에피소드 번호) */
    @Positive(message = "타입에 해당하는 올바른 아이디값을 입력해주세요")
    private Integer typeId;
}