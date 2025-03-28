package com.c109.chaintoon.domain.user.controller;

import com.c109.chaintoon.common.jwt.JwtTokenProvider;
import com.c109.chaintoon.domain.user.dto.request.LoginRequestDto;
import com.c109.chaintoon.domain.user.dto.request.VerifyAuthRequestDto;
import com.c109.chaintoon.domain.user.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;


    // 이메일로 로그인 (인증코드 전송)
    @PostMapping("/email-login")
    public ResponseEntity<?> emailLogin(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        authService.emailLogin(loginRequestDto.getEmail());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 인증코드 검증
    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyAuthCode(
            @Valid @RequestBody VerifyAuthRequestDto verifyAuthRequestDto,
            HttpServletResponse response) {
        String token = authService.verifyEmailCode(verifyAuthRequestDto.getEmail(), verifyAuthRequestDto.getCode());

        // HttpOnly & Secure 쿠키 설정
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
//                .secure(true) // HTTPS 환경에서만 사용
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7일 유효기간
                .sameSite("None") // CSRF 보호
//                .domain("j12c109.p.ssafy.io") // 실제 도메인으로 변경
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok("인증 성공");
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // JWT 쿠키 제거
        Cookie jwtCookie = new Cookie("jwt", null); // 쿠키 이름은 "jwt"
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0); // 쿠키 즉시 삭제
        response.addCookie(jwtCookie);

        return ResponseEntity.ok("로그아웃 성공");
    }
}
