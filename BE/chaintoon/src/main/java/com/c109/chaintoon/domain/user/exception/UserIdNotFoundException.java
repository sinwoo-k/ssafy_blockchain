package com.c109.chaintoon.domain.user.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class UserIdNotFoundException extends NotFoundException {
    public UserIdNotFoundException(Integer userId) {
        super( "해당 userId("+userId+ ")이 존재하지 않습니다.");
    }
}
