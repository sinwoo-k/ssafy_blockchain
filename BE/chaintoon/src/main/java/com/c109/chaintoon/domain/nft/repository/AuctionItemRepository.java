package com.c109.chaintoon.domain.nft.repository;

import com.c109.chaintoon.domain.nft.entity.AuctionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuctionItemRepository extends JpaRepository<AuctionItem, Integer> {
}
