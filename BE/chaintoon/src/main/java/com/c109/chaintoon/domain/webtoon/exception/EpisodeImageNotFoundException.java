package com.c109.chaintoon.domain.webtoon.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class EpisodeImageNotFoundException extends NotFoundException
{
    public EpisodeImageNotFoundException(Integer episodeImageId) {
        super("삭제 또는 없는 에피소드 이미지: " + episodeImageId);
    }
}
