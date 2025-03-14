package com.c109.chaintoon.domain.webtoon.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "episode")
public class Episode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "episode_id")
    private Integer episodeId;

    @Column(name = "webtoon_id", nullable = false)
    private Integer webtoonId;

    @Column(name = "episode_name", length = 50)
    private String episodeName;

    @Column(name = "writer_comment")
    private String writerComment;

    @Column(name = "commentable")
    private String commentable;

    @Column(name = "upload_date", length = 10)
    private String uploadDate;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "comment_count")
    private Long commentCount;

    @Column(name = "rating_sum")
    private Long ratingSum;

    @Column(name = "rating_count")
    private Long ratingCount;

    @Column(name = "previous_episode_id")
    private Integer previousEpisodeId;

    @Column(name = "next_episode_id")
    private Integer nextEpisodeId;

    @Column(name = "deleted", length = 1)
    private String deleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        uploadDate = LocalDate.now().toString();
        commentCount = 0L;
        ratingSum = 0L;
        ratingCount = 0L;
        nextEpisodeId = 0;
        deleted = "N";
        createdAt = LocalDateTime.now();
    }
}