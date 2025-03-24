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
@Table(name = "trading_history")
public class TradingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trading_history_id")
    private Integer tradingHistoryId;

    @Column(name = "auction_item_id")
    private Integer auctionItemId;

    @Column(name = "nft_id")
    private Integer nftId;

    @Column(name = "buyer_id")
    private Integer buyerId;

    @Column(name = "seller_id")
    private Integer sellerId;

    @Column(name = "trading_value")
    private Double tradingValue;

    @Column(name = "trading_date", length = 10)
    private String tradingDate;

    @Column(name = "trading_time", length = 8)
    private String tradingTime;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

}
