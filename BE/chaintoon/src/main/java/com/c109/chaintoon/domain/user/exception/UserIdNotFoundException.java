package com.c109.chaintoon.domain.user.exception;

public class UserIdNotFoundException extends RuntimeException {
    public UserIdNotFoundException(Integer userId) {
        super( "해당 userId("+userId+ ")이 존재하지 않습니다.");
    }
}
