package com.c109.chaintoon.domain.nft.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class InvalidBuyNowPriceException extends NotFoundException {
    public InvalidBuyNowPriceException(String message) {
        super(message);
    }
}
