package com.c109.chaintoon.domain.user.service;

import com.c109.chaintoon.common.exception.UnauthorizedAccessException;
import com.c109.chaintoon.domain.user.dto.request.UserRequestDto;
import com.c109.chaintoon.domain.user.dto.response.SearchUserResponseDto;
import com.c109.chaintoon.domain.user.dto.response.UserResponseDto;
import com.c109.chaintoon.domain.user.entity.User;
import com.c109.chaintoon.domain.user.exception.UserIdNotFoundException;
import com.c109.chaintoon.domain.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 유저 검색
    @Transactional(readOnly = true)
    public List<SearchUserResponseDto> searchByNickname(String keyword, int page, int pageSize){
        // 페이지네이션 (정렬 기준 없음)
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        // 닉네임으로 유저 검색
        Page<User> userPage = userRepository.findByNicknameIgnoreCaseContaining(keyword, pageable);

        return toDto(userPage);
    }

    private List<SearchUserResponseDto> toDto(Page<User> userPage) {
        return userPage.getContent().stream()
                .map(user -> {
                    return SearchUserResponseDto.builder()
                            .nickname(user.getNickname())
                            .id(user.getId())
                            .profileImage(user.getProfileImage())
                            .build();
                }).collect(Collectors.toList());
    }

    // id로 회원 정보 조회
    @Transactional(readOnly = true)
    public UserResponseDto findUserById(Integer userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(userId));

        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .introduction(user.getIntroduction())
                .profileImage(user.getProfileImage())
                .backgroundImage(user.getBackgroundImage())
                .follower(user.getFollower())
                .following(user.getFollowing())
                .joinDate(user.getJoinDate())
                .build();
    }
    
    public UserResponseDto updateUser(Integer userId, UserRequestDto userRequestDto, MultipartFile profileImage, MultipartFile garoImage) {
        // 기존 유저 조회
        User user = userRepository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(userId));
        
        // 수정 권한 없음
        if (!userRequestDto.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("회원 수정 권한이 없습니다.");
        }

        // 이미지 업데이트

        // 회원 정보 업데이트
        user.setNickname(userRequestDto.getNickname());
        user.setIntroduction(userRequestDto.getIntroduction());
        user.setProfileImage(userRequestDto.getProfileImage());
        user.setBackgroundImage(userRequestDto.getBackgroundImage());

        userRepository.save(user);

        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .introduction(user.getIntroduction())
                .profileImage(user.getProfileImage())
                .backgroundImage(user.getBackgroundImage())
                .following(user.getFollowing())
                .follower(user.getFollower())
                .joinDate(user.getJoinDate())
                .build();
    }



}
