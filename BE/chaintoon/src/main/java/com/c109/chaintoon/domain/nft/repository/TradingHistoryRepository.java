package com.c109.chaintoon.domain.nft.repository;

import com.c109.chaintoon.domain.nft.entity.TradingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TradingHistoryRepository extends JpaRepository<TradingHistory, Integer> {
}
