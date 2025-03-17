package com.c109.chaintoon.domain.webtoon.exception;

import com.c109.chaintoon.common.DuplicatedException;

public class RatingDuplicatedException extends DuplicatedException {
    public RatingDuplicatedException(String message) {
        super(message);
    }
}
