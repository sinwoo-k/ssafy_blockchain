package com.c109.chaintoon.domain.webtoon.exeption;

import com.c109.chaintoon.common.NotFoundException;

public class WebtoonNotFoundException extends NotFoundException {
    public WebtoonNotFoundException(Integer webtoonId) {
        super("삭제 또는 없는 웹툰: " + webtoonId);
    }
}
