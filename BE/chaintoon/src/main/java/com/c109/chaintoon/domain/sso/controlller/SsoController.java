package com.c109.chaintoon.domain.sso.controlller;

import com.c109.chaintoon.common.jwt.JwtTokenProvider;
import com.c109.chaintoon.domain.sso.factory.SsoServiceFactory;
import com.c109.chaintoon.domain.sso.payload.SsoAuthToken;
import com.c109.chaintoon.domain.sso.service.SsoService;
import com.c109.chaintoon.domain.user.dto.request.SsoUserRequestDto;
import com.c109.chaintoon.domain.user.service.AuthService;
import com.c109.chaintoon.domain.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sso")
@RequiredArgsConstructor
public class SsoController {

    private final SsoServiceFactory ssoServiceFactory;
    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/providers/{provider}/authorization-uri")
    public String redirectAuthCodeRequestUrl(@PathVariable String provider) {
        SsoService ssoService = ssoServiceFactory.getSsoService(provider);
        return ssoService.getAuthCodeRequestUrl();
    }

    @PostMapping("/providers/{provider}/login")
    public ResponseEntity<String> ssoLogin(
            @PathVariable String provider,
            @RequestBody String code,
            HttpServletResponse response
    ) {
        SsoService ssoService = ssoServiceFactory.getSsoService(provider);
        SsoAuthToken ssoAuthToken = ssoService.getSsoAuthToken(code);
        SsoUserRequestDto userRequest = ssoService.getLoginUserInfo(ssoAuthToken);
        Integer loginId = this.authService.saveUserIfAbsent(userRequest);
        String token = jwtTokenProvider.createAccessToken(loginId, "USER");
        // HttpOnly & Secure 쿠키 설정
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false) // HTTPS 환경에서만 사용
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7일 유효기간
                .sameSite("Lax") // CSRF 보호
                .domain("j12c109.p.ssafy.io") // 실제 도메인으로 변경
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok("인증 성공");
    }

}
