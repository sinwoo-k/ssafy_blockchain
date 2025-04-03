package com.c109.chaintoon.domain.nft.repository;

import com.c109.chaintoon.domain.nft.entity.Nft;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NftRepository extends JpaRepository<Nft, Integer> {
}
