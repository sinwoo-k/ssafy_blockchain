package com.c109.chaintoon.domain.fanart.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class FanartPreferenceNotFoundException extends NotFoundException {
    public FanartPreferenceNotFoundException(Integer fanartId, Integer userId) {
        super("팬아트 " + fanartId + "에 대해 사용자 " + userId + "의 좋아요 기록이 존재하지 않습니다.");
    }
}
