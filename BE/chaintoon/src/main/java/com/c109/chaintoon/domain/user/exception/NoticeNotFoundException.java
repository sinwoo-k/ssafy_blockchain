package com.c109.chaintoon.domain.user.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class NoticeNotFoundException extends NotFoundException {
    public NoticeNotFoundException(Integer noticeId) {
        super("삭제 또는 없는 알림: " + noticeId);
    }
}
