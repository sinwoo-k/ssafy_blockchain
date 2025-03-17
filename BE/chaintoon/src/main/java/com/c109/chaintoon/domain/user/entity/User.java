package com.c109.chaintoon.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private long id;

    @Column(name = "email", length = 50)
    private String email;

    @Column(name = "nickname", length = 20)
    private String nickname;

    private String introduction;

    @Column(name = "profile_image", length = 255)
    private String profileImage;

    @Column(name = "background_image", length = 255)
    private String backgroundImage;

    @Column(name = "follwer")
    private int follwer;

    @Column(name = "follwing")
    private int follwing;


    @Column(name = "deleted", length = 1)
    private String deleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;



}
