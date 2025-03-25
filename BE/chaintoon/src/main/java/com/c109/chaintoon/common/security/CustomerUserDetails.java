package com.c109.chaintoon.common.security;

import com.c109.chaintoon.domain.user.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomerUserDetails implements UserDetails {
    private final User user; // 우리 User 엔티티

    public CustomerUserDetails(User user) {
        this.user = user;
    }


    public Integer getId() {
        return user.getId();
    }

    // 인증 시 사용되는 사용자 이름으로 닉네임을 반환합니다.
    @Override
    public String getUsername() {
        return user.getNickname();
    }

    // 그 외 필수 메서드 구현...
    @Override
    public String getPassword() {
        return "null"; // 비밀번호 필드가 있다면 사용
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 권한 설정에 맞게 반환
        return Collections.emptyList();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return true;
    }
}
