package com.c109.chaintoon.domain.user.controller;

import com.c109.chaintoon.common.jwt.JwtTokenProvider;
import com.c109.chaintoon.domain.user.dto.request.LoginRequestDto;
import com.c109.chaintoon.domain.user.dto.request.VerifyAuthRequestDto;
import com.c109.chaintoon.domain.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;


    // 이메일로 로그인 (인증코드 전송)
    @PostMapping("/email-login")
    public ResponseEntity<?> emailLogin(@RequestBody LoginRequestDto loginRequestDto) {
        authService.emailLogin(loginRequestDto.getEmail());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 인증코드 검증
    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyAuthCode(@RequestBody VerifyAuthRequestDto verifyAuthRequestDto) {
        String token = authService.verifyEmailCode(verifyAuthRequestDto.getEmail(), verifyAuthRequestDto.getCode());
        return ResponseEntity.ok(token);
    }

    
}
