package com.c109.chaintoon.domain.goods.exception;

public class GoodsNotFoundException extends RuntimeException {
    public GoodsNotFoundException(Integer goodsId) {
        super("삭제 또는 없는 굿즈: " + goodsId);
    }
}
