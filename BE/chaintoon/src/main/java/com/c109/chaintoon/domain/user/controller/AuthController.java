package com.c109.chaintoon.domain.user.controller;

import com.c109.chaintoon.domain.user.dto.request.LoginRequestDto;
import com.c109.chaintoon.domain.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // 이메일로 로그인
//    @PostMapping("/email-login")
//    public ResponseEntity<?> emailLogin(@RequestBody LoginRequestDto loginRequestDto) {
//        Integer userId = userService.emailLogin(loginRequestDto.getEmail());
//        return new ResponseEntity<>(userId, HttpStatus.OK);
//    }
}
