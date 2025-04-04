package com.c109.chaintoon.domain.nft.repository;

import com.c109.chaintoon.domain.nft.entity.Nft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NftRepository extends JpaRepository<Nft, Integer> {
    // 로컬 NFT 테이블의 기본키(nft_id)에 해당하는 tokenId 조회
    @Query("SELECT n.tokenId FROM Nft n WHERE n.nftId = :nftId")
    Optional<Integer> findTokenIdByNftId(@Param("nftId") Integer nftId);

    // tokenId에 해당하는 로컬 NFT 테이블의 기본키(nft_id) 조회
    @Query("SELECT n.nftId FROM Nft n WHERE n.tokenId = :tokenId")
    Optional<Integer> findNftIdByTokenId(@Param("tokenId") Integer tokenId);

    boolean existsByWebtoonId(Integer webtoonId);
}
