package com.c109.chaintoon.domain.nft.repository;

import com.c109.chaintoon.domain.nft.entity.TradingHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TradingHistoryRepository extends JpaRepository<TradingHistory, Integer> {

    // 현재 사용자가 판매자로 참여한 거래 내역 조회
    Page<TradingHistory> findBySellerId(Integer sellerId, Pageable pageable);

    // 현재 사용자가 구매자로 참여한 거래 내역 조회
    Page<TradingHistory> findByBuyerId(Integer buyerId, Pageable pageable);
}
