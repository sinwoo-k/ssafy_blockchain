package com.c109.chaintoon.domain.nft.repository;

import com.c109.chaintoon.domain.nft.entity.BiddingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BiddingHistoryRepository extends JpaRepository<BiddingHistory, Integer> {
    Optional<BiddingHistory> findByAuctionItemIdAndUserId(Integer auctionItemId, Integer bidderId);
}
