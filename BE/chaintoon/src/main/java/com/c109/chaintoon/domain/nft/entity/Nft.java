package com.c109.chaintoon.domain.nft.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="nft")
public class Nft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nft_id")
    private Integer nftId;

    @Column(name = "webtoon_id")
    private Integer webtoonId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "token_id")
    private Integer tokenId;

    @Column(name = "contract_address", length = 255)
    private String contractAddress;

    @Column(name = "metadata_uri", length = 1024)
    private String metadataUri;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "title")
    private String title;

    @Column(name = "type_id")
    private Integer typeId;

    @PrePersist
    public void prePersist() {
        if (this.tokenId == null) {
            this.tokenId = 0;
        }
        createdAt = LocalDateTime.now();
    }

}
