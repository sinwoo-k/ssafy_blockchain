package com.c109.chaintoon.domain.webtoon.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "episode_image")
public class EpisodeImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "episode_image_id")
    private Integer episodeImageId;

    @Column(name = "episode_id", nullable = false)
    private Integer episodeId;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "deleted", length = 1)
    private String deleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        deleted = "N";
        createdAt = LocalDateTime.now();
    }
}