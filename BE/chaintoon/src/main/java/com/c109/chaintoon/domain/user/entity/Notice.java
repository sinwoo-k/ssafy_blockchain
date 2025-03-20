package com.c109.chaintoon.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "notice")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Integer noticeId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "checked", length = 1)
    private String checked;

    @Column(name = "metadata", columnDefinition = "json")
    private String metadata;

    @Column(name = "deleted", length = 1)
    private String deleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        checked = "N";
        deleted = "N";
        createdAt = LocalDateTime.now();
    }
}
