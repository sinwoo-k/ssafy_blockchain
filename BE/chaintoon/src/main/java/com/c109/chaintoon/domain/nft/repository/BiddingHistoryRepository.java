package com.c109.chaintoon.domain.nft.repository;

import com.c109.chaintoon.domain.nft.dto.response.BiddingHistoryResponseDto;
import com.c109.chaintoon.domain.nft.entity.BiddingHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BiddingHistoryRepository extends JpaRepository<BiddingHistory, Integer> {
    List<BiddingHistory> findByAuctionItemIdAndUserIdAndLatestTrue(Integer auctionItemId, Integer userId);

    List<BiddingHistory> findByAuctionItemIdOrderByBiddingPriceDesc(Integer auctionItem);

    Page<BiddingHistory> findByAuctionItemIdOrderByBiddingPriceDesc(Integer auctionItemId, Pageable pageable);

    List<BiddingHistory> findAllByAuctionItemIdAndLatestTrueOrderByBiddingPriceDesc(Integer auctionItem);
}
