package com.c109.chaintoon.domain.comment.code;

import lombok.Getter;

@Getter
public enum CommentType {
    EPISODE("에피소드", "COMMENT_EPISODE"),
    FANART("팬아트", "COMMENT_FANART");

    private final String description;
    private final String value;

    CommentType(String description, String value) {
        this.description = description;
        this.value = value;
    }
}