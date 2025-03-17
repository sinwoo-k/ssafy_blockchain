package com.c109.chaintoon.domain.user.entity;

import com.c109.chaintoon.domain.user.dto.response.SearchUserResponseDto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

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

    @ColumnDefault("0")
    @Column(name = "follower")
    private Integer follower;

    @ColumnDefault("0")
    @Column(name = "following")
    private Integer following;

    @Column(name = "join_date", length = 10)
    private String joinDate;

    @ColumnDefault("N")
    @Column(name = "deleted", length = 1)
    private String deleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ColumnDefault("Y")
    @Column(name = "status", length = 1)
    private String status;

    @PostPersist
    public void initNickname() {
        this.nickname = Integer.toString(this.id);
    }

}
