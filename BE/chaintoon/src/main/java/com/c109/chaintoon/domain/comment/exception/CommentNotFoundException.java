package com.c109.chaintoon.domain.comment.exception;

import com.c109.chaintoon.common.exception.NotFoundException;

public class CommentNotFoundException extends NotFoundException {
    public CommentNotFoundException(Integer commentId) {
        super("삭제 또는 없는 댓글: " + commentId);
    }
}
