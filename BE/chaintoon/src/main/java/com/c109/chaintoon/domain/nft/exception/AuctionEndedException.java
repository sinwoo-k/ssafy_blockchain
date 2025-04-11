package com.c109.chaintoon.domain.nft.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class AuctionEndedException extends IllegalArgumentException {
    public AuctionEndedException(String message) {
        super(message);
    }
}
