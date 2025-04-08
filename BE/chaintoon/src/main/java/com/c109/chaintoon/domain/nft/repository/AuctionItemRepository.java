package com.c109.chaintoon.domain.nft.repository;

import com.c109.chaintoon.domain.nft.entity.AuctionItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuctionItemRepository extends JpaRepository<AuctionItem, Integer>, JpaSpecificationExecutor<AuctionItem> {

    @Query("select distinct a from AuctionItem a join BiddingHistory b on a.auctionItemId = b.auctionItemId " +
            "where a.ended = 'N' and b.userId = :userId and b.latest = true")
    Page<AuctionItem> findActiveTradesByBidder(@Param("userId") Integer userId,
                                               Pageable pageable);

    @Query("select a from AuctionItem a join Nft n on a.nftId = n.nftId " +
            "where a.ended = 'N' " +
            "and n.userId = :userId " +
            "and a.blockchainStatus = 'SUCCESS'")
    Page<AuctionItem> findActiveSaleItems(@Param("userId") Integer userId,
                                          Pageable pageable);

    Optional<AuctionItem> findByNftIdAndEnded(Integer nftId, String ended);
}
