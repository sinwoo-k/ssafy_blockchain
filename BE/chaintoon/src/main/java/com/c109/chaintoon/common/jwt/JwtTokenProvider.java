package com.c109.chaintoon.common.jwt;


import com.c109.chaintoon.common.exception.ServerException;
import com.c109.chaintoon.domain.user.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtTokenProvider {

    // 실제 운영 시 yml나 환경변수에서 주입받음
    @Value("${jwt.secret-key-access}")
    private String accessSecretKey;

    @Value("${jwt.access-token-validity-in-ms}")
    private long accessTokenValidityInMilliseconds;

    @Value("${jwt.refresh-token-validity-in-ms}")
    private long refreshValidityInMilliseconds;

    private Key accessKey;

    @PostConstruct
    public void init() {
        // 시크릿키를 Key 객체로 변환
        this.accessKey = Keys.hmacShaKeyFor(accessSecretKey.getBytes());
    }

    /**
     * Access Token 생성
     * @param userId
     * @return
     */
    public String createAccessToken(Integer userId, String role) {
        Claims claims = Jwts.claims().setSubject(String.valueOf(userId));
        claims.put("role", role);

        Date now = new Date();
        Date validity = new Date(now.getTime() + accessTokenValidityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(accessKey, SignatureAlgorithm.HS256)
                .compact();
    }


    /**
     * 토큰 유효성 & 만료일자 확인
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(accessKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Invalid or expired JWT token", e);
            return false;
        }
    }


    public Authentication getAuthentication(String token) {
        // 키 변수명 수정 (accessKey 사용)
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(accessKey)  // key -> accessKey
                .build()
                .parseClaimsJws(token)
                .getBody();

        // 권한 정보 추출 방식 변경
        String role = claims.get("role", String.class);
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + role)
        );

        // 사용자 식별 정보 설정 (User 대신 userId 사용)
        Integer userId = Integer.valueOf(claims.getSubject());

        return new UsernamePasswordAuthenticationToken(
                userId,
                null,
                authorities
        );
    }


}
