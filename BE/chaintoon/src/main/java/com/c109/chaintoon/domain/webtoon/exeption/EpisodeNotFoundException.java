package com.c109.chaintoon.domain.webtoon.exeption;

import com.c109.chaintoon.common.NotFoundException;

public class EpisodeNotFoundException extends NotFoundException {
    public EpisodeNotFoundException(Integer episodeId) {
        super("삭제 또는 없는 웹툰: " + episodeId);
    }
}
