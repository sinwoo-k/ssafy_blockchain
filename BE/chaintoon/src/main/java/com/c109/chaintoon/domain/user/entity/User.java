package com.c109.chaintoon.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    @Column(name = "email", length = 50, nullable = false, unique = true)
    private String email;

    @Column(name = "nickname", length = 20, nullable = false, unique = true)
    private String nickname;

    @Column(name = "introduction", length = 255)
    private String introduction;

    @Column(name = "profile_image", length = 255)
    private String profileImage;

    @Column(name = "background_image", length = 255)
    private String backgroundImage;

    @Column(name = "url", length = 255)
    private String url;

    @Column(name = "follower")
    private Integer follower = 0;

    @Column(name = "following")
    private Integer following = 0;

    @Column(name = "join_date", length = 10)
    private String joinDate;

    @Column(name = "sso_type", length = 50)
    private String ssoType;

    @Column(name = "deleted", length = 1)
    private String deleted;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "status", length = 1)
    private String status;

    @PrePersist
    public void prePersist() {
        joinDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        following = 0;
        follower = 0;
        introduction = "";
        deleted = "N";
        status = "Y";
        backgroundImage = "";
        profileImage = "";
        url = "";
    }
}
