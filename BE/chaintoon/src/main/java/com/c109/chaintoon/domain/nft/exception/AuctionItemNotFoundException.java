package com.c109.chaintoon.domain.nft.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class AuctionItemNotFoundException extends NotFoundException {
    public AuctionItemNotFoundException(Integer auctionItemId) {
        super("삭제 또는 없는 경매 아이템 ID: " + auctionItemId);
    }
}
