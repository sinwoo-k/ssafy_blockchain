package com.c109.chaintoon.domain.fanart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fanart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fanart_id")
    private Integer fanartId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "webtoon_id", nullable = false)
    private Integer webtoonId;

    @Column(name = "fanart_name", length = 50)
    private String fanartName;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "fanart_image", length = 255)
    private String fanartImage;

    @Column(name = "like_count")
    private Integer likeCount;

    @Column(name = "comment")
    private Integer comment;

    @Column(name = "deleted", length = 1)
    private String deleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (likeCount == null) {likeCount = 0;}
        if (comment == null) {comment = 0;}
        if (deleted == null) {deleted = "N";}
        if (createdAt == null) {createdAt = LocalDateTime.now();}
    }
}
