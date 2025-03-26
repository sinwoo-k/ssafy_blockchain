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

    @Column(name = "bidder_id")
    private Integer bidderId;

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

    @PrePersist
    protected void onCreate() {
        if (bidderId == null) {
            bidderId = 0;
        }
        startTime = LocalDateTime.now();
        ended = "N";
        createdAt = LocalDateTime.now();
        success = "N";
    }

}
