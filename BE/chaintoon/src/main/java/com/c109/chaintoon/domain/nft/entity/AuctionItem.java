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
@Table(name = "auction_item")
public class AuctionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auction_item_id")
    private Integer auctionItemId;

    @Column(name = "nft_id")
    private Integer nftId;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "bidding_price")
    private Double biddingPrice;

    @Column(name = "buy_now_price")
    private Double buyNowPrice;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "ended", length = 1)
    private String ended;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "success", length = 1)
    private String success;

    @Column(name = "blockchain_status", length = 20)
    private String blockchainStatus;

    @Version
    @Column(name = "version")
    private Integer version = 0;

    @PrePersist
    protected void onCreate() {
        startTime = LocalDateTime.now();
        ended = "N";
        createdAt = LocalDateTime.now();
        success = "N";
        blockchainStatus = "PENDING";
    }

}
