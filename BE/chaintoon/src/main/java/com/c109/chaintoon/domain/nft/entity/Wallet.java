package com.c109.chaintoon.domain.nft.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "wallet")
@Data
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wallet_id")
    private Integer walletId;

    @Column(name = "wallet_address", length = 42)
    private String walletAddress;

    @Column(name = "private_key", length = 255)
    private String privateKey;

    @Column(name = "public_key", length = 255)
    private String publicKey;

    @Column(name = "recovery_phrase", length = 255)
    private String recoveryPhrase;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    @Column(name = "user_id")
    private Integer userId;
}