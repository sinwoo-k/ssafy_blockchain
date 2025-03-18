package com.c109.chaintoon.domain.webtoon.exception;

public class FanartNotFoundException extends RuntimeException {
    public FanartNotFoundException(Integer fanartId) {
        super("삭제 또는 없는 팬아트: " + fanartId);
    }
}
