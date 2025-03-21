package com.c109.chaintoon.domain.comment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Integer commentId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "usage_id", nullable = false)
    private Integer usageId;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "parent_id")
    private Integer parentId;

    @Column(name = "content")
    private String content;

    @Column(name = "reply_count")
    private Long replyCount;

    @Column(name = "like_count")
    private Long likeCount;

    @Column(name = "hate_count")
    private Long hateCount;

    @Column(name = "deleted", length = 1)
    private String deleted;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        replyCount = 0L;
        likeCount = 0L;
        hateCount = 0L;
        deleted = "N";
        updatedAt = LocalDateTime.now();
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
