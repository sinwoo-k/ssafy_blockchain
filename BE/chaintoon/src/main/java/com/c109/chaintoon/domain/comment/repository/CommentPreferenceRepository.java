package com.c109.chaintoon.domain.comment.repository;

import com.c109.chaintoon.domain.comment.entity.CommentPreference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentPreferenceRepository extends JpaRepository<CommentPreference, Integer> {
    Optional<CommentPreference> findByCommentIdAndUserId(Integer commentId, Integer userId);
}
