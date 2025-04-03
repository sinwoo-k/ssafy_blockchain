package com.c109.chaintoon.domain.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private Integer id;
    private String email;
    private String nickname;
    private String introduction;
    private String profileImage;
    private String backgroundImage;
    private Integer follower;
    private Integer following;
    private String url;
    private String joinDate;
}
