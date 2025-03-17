package com.c109.chaintoon.domain.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchUserResponseDto {

    private Integer id;
    private String nickname;
    private String profileImage;
}
