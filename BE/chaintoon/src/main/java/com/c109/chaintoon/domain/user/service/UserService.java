package com.c109.chaintoon.domain.user.service;

import com.c109.chaintoon.common.oauth.AuthCodeGenerator;
import com.c109.chaintoon.domain.user.dto.response.SearchUserResponseDto;
import com.c109.chaintoon.domain.user.entity.User;
import com.c109.chaintoon.domain.user.exception.UserNotFoundException;
import com.c109.chaintoon.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public List<SearchUserResponseDto> searchByNickname(String search, int page, int pageSize){
        List<User> list = userRepository.findByNickname(search);

        return list.stream()
                .map(user -> SearchUserResponseDto.builder()
                        .id(user.getId())
                        .nickname(user.getNickname())
                        .profileImage(user.getProfileImage())
                        .build())
                .collect(Collectors.toList());
    }



}
