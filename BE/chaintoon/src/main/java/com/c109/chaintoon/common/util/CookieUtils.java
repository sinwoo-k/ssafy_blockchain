package com.c109.chaintoon.common.util;

import com.c109.chaintoon.common.jwt.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CookieUtils {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 쿠키에서 JWT를 추출하여 사용자 ID를 반환
     *
     * @param request HttpServletRequest 객체
     * @return 사용자 ID (Integer)
     */
    public Integer getUserIdFromCookie(HttpServletRequest request) {
        String token = null;

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) { // 쿠키 이름 확인
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null || !jwtTokenProvider.validateToken(token, true)) {
            throw new IllegalArgumentException("Invalid or expired token");
        }

        return jwtTokenProvider.getUserId(token, true); // JWT에서 사용자 ID 추출
    }
}