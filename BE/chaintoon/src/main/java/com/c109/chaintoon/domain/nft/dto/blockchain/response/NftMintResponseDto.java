package com.c109.chaintoon.domain.nft.dto.blockchain.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NftMintResponseDto {
    /** 응답 상태 (예: "success") */
    private String status;
    /** 생성된 NFT 토큰 ID */
    private String tokenId;
    /** NFT 메타데이터 */
    private Metadata metadata;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Metadata {
        /** NFT 제목 */
        private String title;

        /** NFT 설명 */
        private String description;

        /** NFT 이미지 URL */
        private String image;

        /** 지갑 정보 */
        private Wallets wallets;

        /** 수익 분배 정보 */
        private RevenueDistribution revenueDistribution;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Wallets {
        /** 원작자 지갑 주소 */
        private String originalCreator;

        /** NFT 소유자 지갑 주소 */
        private String owner;

        /** 관리자 지갑 주소 */
        private String adminWallet;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RevenueDistribution {
        /** 원작자 수익 분배 비율 */
        private String originalCreator;

        /** 소유자 수익 분배 비율 */
        private String owner;

        /** 관리자 수익 분배 비율 */
        private String adminWallet;
    }
}
