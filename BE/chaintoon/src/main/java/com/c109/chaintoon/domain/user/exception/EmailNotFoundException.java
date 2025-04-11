package com.c109.chaintoon.domain.user.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class EmailNotFoundException extends NotFoundException {
    public EmailNotFoundException(String email) {
        super("해당 이메일("+email+")이 존재하지 않습니다");
    }
}
