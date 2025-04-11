package com.c109.chaintoon.domain.nft.exception;

public class AuctionUpdateConflictException extends RuntimeException {
    public AuctionUpdateConflictException(String message) {
        super(message);
    }
}
