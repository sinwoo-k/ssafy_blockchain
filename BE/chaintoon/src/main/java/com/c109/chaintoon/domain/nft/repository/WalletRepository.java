package com.c109.chaintoon.domain.nft.repository;

import com.c109.chaintoon.domain.nft.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet,Integer> {
    @Query("SELECT w.userId FROM Wallet w WHERE w.walletAddress = :walletAddress")
    Optional<Integer> findUserIdByWalletAddress(@Param("walletAddress") String walletAddress);

    @Query("SELECT w.walletAddress FROM Wallet w WHERE w.userId = :userId")
    Optional<String> findWalletAddressByUserId(@Param("userId") Integer userId);
}
