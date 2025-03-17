package com.c109.chaintoon.domain.webtoon.exeption;

import com.c109.chaintoon.common.NotFoundException;

public class WebtoonNotFoundException extends NotFoundException {
    public WebtoonNotFoundException(Integer webtoonId) {
        super("Webtoon with id " + webtoonId + " not found");
    }
}
