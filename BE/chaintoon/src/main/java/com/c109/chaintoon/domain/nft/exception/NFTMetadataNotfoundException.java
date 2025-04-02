package com.c109.chaintoon.domain.nft.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class NFTMetadataNotfoundException extends NotFoundException {
    public NFTMetadataNotfoundException(String message) {
        super(message);
    }
}
