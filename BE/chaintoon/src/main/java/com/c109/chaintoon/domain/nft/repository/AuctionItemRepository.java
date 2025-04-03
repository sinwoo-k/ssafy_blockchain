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

    Page<AuctionItem> findByTypeAndEnded(String type, String ended, Pageable pageable);

    Page<AuctionItem> findByType(String type, Pageable pageable);

    @Query("select a from AuctionItem a join Nft n on a.nftId = n.nftId " +
            "where a.ended = :ended and n.userId = :userId")
    Page<AuctionItem> findByEndedAndUserId(@Param("ended") String ended,
                                           @Param("userId") Integer userId,
                                           Pageable pageable);
}
