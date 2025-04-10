package com.c109.chaintoon.domain.nft.exception;



public class WalletBalanceException extends IllegalArgumentException {
    public WalletBalanceException(String message) {
        super(message);
    }
}
