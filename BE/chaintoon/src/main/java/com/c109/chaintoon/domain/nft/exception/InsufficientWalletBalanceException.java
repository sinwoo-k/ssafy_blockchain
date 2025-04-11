package com.c109.chaintoon.domain.nft.exception;

public class InsufficientWalletBalanceException extends IllegalArgumentException {
    public InsufficientWalletBalanceException(String message) {
        super(message);
    }
}
