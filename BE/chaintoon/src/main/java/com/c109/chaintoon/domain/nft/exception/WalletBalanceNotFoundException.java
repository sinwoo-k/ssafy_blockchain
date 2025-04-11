package com.c109.chaintoon.domain.nft.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class WalletBalanceNotFoundException extends NotFoundException {
    public WalletBalanceNotFoundException(String message) {
        super(message);
    }
}
