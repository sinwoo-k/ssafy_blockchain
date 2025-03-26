package com.c109.chaintoon.domain.sso.service;


import com.c109.chaintoon.domain.sso.payload.SsoAuthToken;
import com.c109.chaintoon.domain.user.dto.request.SsoUserRequestDto;

public interface SsoService {
    String getAuthCodeRequestUrl();

    SsoAuthToken getSsoAuthToken(String code);

    SsoUserRequestDto getLoginUserInfo(SsoAuthToken token);
}
