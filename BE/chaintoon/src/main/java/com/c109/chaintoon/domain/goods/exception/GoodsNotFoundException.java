package com.c109.chaintoon.domain.goods.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class GoodsNotFoundException extends NotFoundException {
    public GoodsNotFoundException(Integer goodsId) {
        super("삭제 또는 없는 굿즈: " + goodsId);
    }
}
