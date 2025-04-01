package com.c109.chaintoon.domain.nft.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class InvalidBidPriceException extends NotFoundException {
    public InvalidBidPriceException(String message) {
        super(message);
    }
}
