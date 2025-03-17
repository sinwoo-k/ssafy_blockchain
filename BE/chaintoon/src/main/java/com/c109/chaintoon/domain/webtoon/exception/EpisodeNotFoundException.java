package com.c109.chaintoon.domain.webtoon.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class EpisodeNotFoundException extends NotFoundException {
    public EpisodeNotFoundException(Integer episodeId) {
        super("삭제 또는 없는 웹툰: " + episodeId);
    }
}
