package com.c109.chaintoon.domain.nft.repository;

import com.c109.chaintoon.domain.nft.entity.AuctionItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuctionItemRepository extends JpaRepository<AuctionItem, Integer> {

    @Query("select a from AuctionItem a join Nft n on a.nftId = n.nftId where a.type = :type and n.webtoonId = :webtoonId and a.ended = :ended")
    Page<AuctionItem> findByTypeAndWebtoonIdAndEnded(@Param("type") String type, @Param("webtoonId") Integer webtoonId, @Param("ended") String ended, Pageable pageable);

    @Query("select a from AuctionItem a join Nft n on a.nftId = n.nftId where a.type = :type and n.webtoonId = :webtoonId")
    Page<AuctionItem> findByTypeAndWebtoonId(@Param("type") String type, @Param("webtoonId") Integer webtoonId, Pageable pageable);

    @Query("select a from AuctionItem a join Nft n on a.nftId = n.nftId " +
            "where a.ended = :ended and n.userId = :userId")
    Page<AuctionItem> findByEndedAndUserId(@Param("ended") String ended,
                                           @Param("userId") Integer userId,
                                           Pageable pageable);

    @Query("select distinct a from AuctionItem a join BiddingHistory b on a.auctionItemId = b.auctionItemId " +
            "where a.ended = 'N' and b.userId = :userId and b.latest = true")
    Page<AuctionItem> findActiveTradesByBidder(@Param("userId") Integer userId,
                                               Pageable pageable);

    @Query("select a from AuctionItem a join Nft n on a.nftId = n.nftId " +
            "where a.ended = 'N' and n.userId = :userId")
    Page<AuctionItem> findActiveSaleItems(@Param("userId") Integer userId,
                                          Pageable pageable);
}
