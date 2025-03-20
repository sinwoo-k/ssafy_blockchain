package com.c109.chaintoon.domain.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowingResponseDto {
    private Integer userId;
    private String nickname;
    private String profile;
}
