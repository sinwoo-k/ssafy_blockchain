package com.c109.chaintoon.domain.nft.exception;

import com.c109.chaintoon.common.exception.DuplicatedException;

public class DuplicateAuctionException extends DuplicatedException {
    public DuplicateAuctionException(String message) {
        super(message);
    }
}
