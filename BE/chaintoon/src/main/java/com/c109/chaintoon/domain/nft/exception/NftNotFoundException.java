package com.c109.chaintoon.domain.nft.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class NftNotFoundException extends NotFoundException {
    public NftNotFoundException(Integer nftId) {
        super("삭제 또는 없는 NFT ID: " + nftId);
    }
}
