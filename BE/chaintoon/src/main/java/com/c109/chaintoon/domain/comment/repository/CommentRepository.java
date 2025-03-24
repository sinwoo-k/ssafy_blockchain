package com.c109.chaintoon.domain.comment.repository;

import com.c109.chaintoon.domain.comment.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    Page<Comment> findByParentIdAndDeleted(Integer parentId, String deleted, Pageable pageable);

    Page<Comment> findByUsageIdAndTypeAndParentIdAndDeleted(Integer usageId, String type, Integer parentId, String deleted, Pageable pageable);

    Optional<Comment> findByCommentIdAndDeleted(Integer commentId, String deleted);
}
