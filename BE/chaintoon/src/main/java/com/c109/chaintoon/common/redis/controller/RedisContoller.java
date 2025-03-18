package com.c109.chaintoon.common.redis.controller;

import com.c109.chaintoon.common.redis.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/redis")
public class RedisContoller {

    private final RedisService redisService;

    @GetMapping("/test")
    public ResponseEntity<String> testRedis() {
        return ResponseEntity.ok(redisService.testRedis());
    }
}
