package com.c109.chaintoon.domain.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {
    private Integer userId;
    private String nickname;
    private String introduction;
    private String profileImage;
    private String backgroundImage;

}
