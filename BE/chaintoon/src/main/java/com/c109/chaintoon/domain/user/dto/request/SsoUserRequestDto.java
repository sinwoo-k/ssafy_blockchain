package com.c109.chaintoon.domain.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SsoUserRequestDto {
    private String userId;
    private String loginId; //email
    private String name;

    public void setEmail(String email) {
        this.loginId = email;
    }
}
