package com.c109.chaintoon.domain.fanart.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class FanartNotFoundException extends NotFoundException {
    public FanartNotFoundException(Integer fanartId) {
        super("삭제 또는 없는 팬아트: " + fanartId);
    }
}
