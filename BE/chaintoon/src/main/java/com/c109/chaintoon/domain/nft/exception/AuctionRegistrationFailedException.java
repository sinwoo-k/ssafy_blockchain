package com.c109.chaintoon.domain.nft.exception;

import com.c109.chaintoon.common.exception.NotFoundException;
import com.c109.chaintoon.common.exception.ServerException;

public class AuctionRegistrationFailedException extends ServerException {
    public AuctionRegistrationFailedException(String message) {
        super(message);
    }
}
