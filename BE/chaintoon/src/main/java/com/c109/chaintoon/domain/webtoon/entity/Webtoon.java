package com.c109.chaintoon.domain.webtoon.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Webtoon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "webtoon_id")
    private Integer webtoonId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "webtoon_name", length = 50)
    private String webtoonName;

    @Column(name = "genre", length = 10)
    private String genre;

    @Column(name = "summary", length = 500)
    private String summary;

    @Column(name = "adaptable", length = 1)
    private String adaptable;

    @Column(name = "garo_thumbnail", length = 255)
    private String garoThumbnail;

    @Column(name = "sero_thumbnail", length = 255)
    private String seroThumbnail;

    @Column(name = "last_upload_date", length = 10)
    private String lastUploadDate;

    @Column(name = "episode_count")
    private Integer episodeCount;

    @Column(name = "view_count")
    private Long viewCount;

    @Column(name = "rating_sum")
    private Long ratingSum;

    @Column(name = "rating_count")
    private Long ratingCount;

    @Column(name = "deleted", length = 1)
    private String deleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        lastUploadDate = "";
        episodeCount = 0;
        viewCount = 0L;
        ratingSum = 0L;
        ratingCount = 0L;
        deleted = "N";
        createdAt = LocalDateTime.now();
    }

}
