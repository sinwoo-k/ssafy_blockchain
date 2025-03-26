package com.c109.chaintoon.common.redis.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    public void setValue(String key, Object value, long timeout) {
        redisTemplate.opsForValue().set(key, value, timeout, TimeUnit.MINUTES);
    }

    public Object getValue(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void deleteValue(String key) {
        redisTemplate.delete(key);
    }

    public String testRedis() {
        redisTemplate.opsForValue().set("testKey", "Hello Redis!");

        return Optional.ofNullable(redisTemplate.opsForValue().get("testKey"))
                .map(Object::toString)
                .orElse(null);

    }

    public boolean isTokenBlacklisted(String tokenId) {
        return Optional.ofNullable(redisTemplate.opsForValue().get(tokenId))
                .map(value -> "blacklisted".equals(value.toString()))
                .orElse(false);
    }

}