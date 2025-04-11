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
@Table(name = "bidding_history")
public class BiddingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bidding_history_id")
    private Integer biddingHistoryId;

    @Column(name = "auction_item_id")
    private Integer auctionItemId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "bidding_price")
    private Double biddingPrice;

    @Column(name = "bid_time")
    private LocalDateTime bidTime;

    @Column(name = "latest")
    private Boolean latest;
}
