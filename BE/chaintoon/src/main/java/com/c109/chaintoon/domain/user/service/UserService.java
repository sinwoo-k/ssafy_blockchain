package com.c109.chaintoon.domain.user.service;

import com.c109.chaintoon.common.s3.service.S3Service;
import com.c109.chaintoon.domain.search.code.SearchType;
import com.c109.chaintoon.domain.search.dto.response.SearchResponseDto;
import com.c109.chaintoon.domain.user.dto.request.UserRequestDto;
import com.c109.chaintoon.domain.user.dto.response.FollowingResponseDto;
import com.c109.chaintoon.domain.user.dto.response.MyInfoResponseDto;
import com.c109.chaintoon.domain.user.dto.response.SearchUserResponseDto;
import com.c109.chaintoon.domain.user.dto.response.UserResponseDto;
import com.c109.chaintoon.domain.user.entity.Following;
import com.c109.chaintoon.domain.user.entity.FollowingId;
import com.c109.chaintoon.domain.user.entity.User;
import com.c109.chaintoon.domain.user.exception.UserIdNotFoundException;
import com.c109.chaintoon.domain.user.repository.FolllowingRepository;
import com.c109.chaintoon.domain.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
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
    private final FolllowingRepository followingRepository;
    private final S3Service s3Service;

    // 유저 검색
    @Transactional(readOnly = true)
    public SearchResponseDto<SearchUserResponseDto> searchByNickname(String keyword, int page, int pageSize) {
        // 페이지네이션 (정렬 기준 없음)
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        // 닉네임으로 유저 검색
        Page<User> userPage = userRepository.findByNicknameIgnoreCaseContaining(keyword, pageable);

        return SearchResponseDto.<SearchUserResponseDto>builder()
                .type(SearchType.USER.getValue())
                .totalCount(userPage.getTotalElements())
                .searchResult(toList(userPage))
                .build();
    }

    private List<SearchUserResponseDto> toList(Page<User> userPage) {
        return userPage.getContent().stream()
                .map(user -> SearchUserResponseDto.builder()
                        .nickname(user.getNickname())
                        .id(user.getId())
                        .profileImage(s3Service.getPresignedUrl(user.getProfileImage()))
                        .build()).toList();
    }

    // 개인정보 미포함, 현재는 동일
    private UserResponseDto toUserResponseDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .introduction(user.getIntroduction())
                .profileImage(s3Service.getPresignedUrl(user.getProfileImage()))
                .backgroundImage(s3Service.getPresignedUrl(user.getBackgroundImage()))
                .follower(user.getFollower())
                .following(user.getFollowing())
                .url(user.getUrl())
                .joinDate(user.getJoinDate())
                .build();
    }

    // 개인정보 포함
    private MyInfoResponseDto toMyInfoResponseDto(User user) {
        return MyInfoResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .introduction(user.getIntroduction())
                .profileImage(s3Service.getPresignedUrl(user.getProfileImage()))
                .backgroundImage(s3Service.getPresignedUrl(user.getBackgroundImage()))
                .follower(user.getFollower())
                .following(user.getFollowing())
                .url(user.getUrl())
                .joinDate(user.getJoinDate())
                .build();
    }

    // id로 회원 정보 조회
    @Transactional(readOnly = true)
    public UserResponseDto findUserById(Integer userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(userId));

        return toUserResponseDto(user);
    }

    // 내 정보 조회
    @Transactional
    public MyInfoResponseDto getMyInfo(Integer loginId){
        User user = userRepository.findById(loginId).orElseThrow(() -> new UserIdNotFoundException(loginId));

        return toMyInfoResponseDto(user);
    }

    // 회원 정보 수정
    @PreAuthorize("hasRole('USER')")
    public MyInfoResponseDto updateUser(Integer userId, UserRequestDto userRequestDto, MultipartFile profileImage) {
        // 기존 유저 조회
        User user = userRepository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(userId));

        // 프로필 이미지 업데이트
        if (profileImage != null && !profileImage.isEmpty()) {
            s3Service.deleteFile(user.getProfileImage());

            String profileUrl = uploadProfile(userId, profileImage);
            user.setProfileImage(profileUrl);
        }

        // 회원 정보 업데이트
        user.setNickname(userRequestDto.getNickname());
        user.setIntroduction(userRequestDto.getIntroduction());
        user.setUrl(userRequestDto.getUrl());

        userRepository.save(user);

        return toMyInfoResponseDto(user);
    }

    // 프로필 이미지 업로드
    private String uploadProfile(Integer userId, MultipartFile file){
        return s3Service.uploadFile(file, "user/" + userId + "/profile");
    }

    @PreAuthorize("hasRole('USER')")
    public String updateBackgroundImage(Integer userId, MultipartFile backgroundImage) {
        // 기존 유저 조회
        User user = userRepository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(userId));

        // 배경 이미지 업데이트
        if(backgroundImage != null && !backgroundImage.isEmpty()) {
            s3Service.deleteFile(user.getBackgroundImage());

            String backgroundUrl = uploadBackground(userId, backgroundImage);
            user.setBackgroundImage(backgroundUrl);
        }

        userRepository.save(user);
        return user.getBackgroundImage();
    }

    // 배경 이미지 업로드
    private String uploadBackground(Integer userId, MultipartFile file){
        return s3Service.uploadFile(file, "user/" + userId + "/background");
    }

    // 닉네임 중복 확인
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('USER')")
    public boolean checkNickname(String nickname){
        return userRepository.existsByNicknameAndDeleted(nickname, "N");
    }

    // 프로필 이미지 제거
    @Transactional
    @PreAuthorize("hasRole('USER')")
    public MyInfoResponseDto deleteProfile(Integer userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(userId));

        if(user.getProfileImage() != null) {
            s3Service.deleteFile(user.getProfileImage());
        }
        user.setProfileImage(null);
        userRepository.save(user);

        return toMyInfoResponseDto(user);
    }

    // 배경 이미지 제거
    @Transactional
    @PreAuthorize("hasRole('USER')")
    public MyInfoResponseDto deleteBackground(Integer userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(userId));

        if(user.getBackgroundImage() != null) {
            s3Service.deleteFile(user.getBackgroundImage());
        }
        user.setBackgroundImage(null);
        userRepository.save(user);

        return toMyInfoResponseDto(user);
    }

    // 팔로우
    @Transactional
    @PreAuthorize("hasRole('USER')")
    public void addFollow(Integer followerId, Integer followeeId) {
        // 자신을 팔로우할 수 없음
        if(followerId.equals(followeeId)) {
            return;
        }

        User followee = userRepository.findById(followeeId).orElseThrow(() -> new UserIdNotFoundException(followeeId));
        User follower = userRepository.findById(followerId).orElseThrow(() -> new UserIdNotFoundException(followerId));

        // 복합키 생성
        FollowingId id = new FollowingId(followerId, followeeId);

        // 중복 체크 (이미 팔로우한 유저인지 확인)
        if(followingRepository.existsById(id)) {
            return;
        }

        // 팔로우, 팔로워 수 증가
        followee.setFollower(followee.getFollower() + 1);
        follower.setFollowing(follower.getFollowing() + 1);
        userRepository.save(followee);
        userRepository.save(follower);


        // Following 엔티티 생성
        Following following = new Following(id);

        // 데이터베이스에 저장
        followingRepository.save(following);
    }

    // 팔로우 취소
    @Transactional
    @PreAuthorize("hasRole('USER')")
    public void removeFollow(Integer followerId, Integer followeeId) {
        // 자신을 팔로우 취소할 수 없음
        if(followerId.equals(followeeId)) {
            return;
        }

        User followee = userRepository.findById(followeeId).orElseThrow(() -> new UserIdNotFoundException(followeeId));
        User follower = userRepository.findById(followerId).orElseThrow(() -> new UserIdNotFoundException(followerId));

        // 복합키 생성
        FollowingId id = new FollowingId(followerId, followeeId);

        // 엔티티 존재 여부 확인
        if(!followingRepository.existsById(id)) {
            return;
        }

        // 팔로우, 팔로워 수 감소
        followee.setFollower(followee.getFollower() - 1);
        follower.setFollowing(follower.getFollowing() - 1);
        userRepository.save(followee);
        userRepository.save(follower);

        // 데이터베이스에서 삭제
        followingRepository.deleteById(id);
    }

    // 팔로우 목록 조회
    @Transactional(readOnly = true)
    public List<FollowingResponseDto> getFollowingList(Integer userId, int page, int pageSize) {
        // 페이지네이션
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        // 팔로우중인 사용자 목록 조회
        List<Integer> follwingIdList=followingRepository.findFollowingsById(userId);

        // 팔로우 목록을 기반으로 사용자 조회
        Page<User> userPage = userRepository.findByIdIn(follwingIdList, pageable);

        // 조회 결과 DTO 변환
        return toFollowDto(userPage);
    }

    // 팔로워 목록 조회
    @Transactional(readOnly = true)
    public List<FollowingResponseDto> getFollowerList(Integer userId, int page, int pageSize) {
        // 페이지네이션
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        // 팔로우중인 사용자 목록 조회
        List<Integer> follweeIdList=followingRepository.findFollowersById(userId);

        // 팔로우 목록을 기반으로 사용자 조회
        Page<User> userPage = userRepository.findByIdIn(follweeIdList, pageable);

        // 조회 결과 DTO 변환
        return toFollowDto(userPage);
    }

    private List<FollowingResponseDto> toFollowDto(Page<User> userPage) {
        return userPage.getContent().stream()
                .map(user -> FollowingResponseDto.builder()
                        .profile(s3Service.getPresignedUrl(user.getProfileImage()))
                        .userId(user.getId())
                        .nickname(user.getNickname())
                        .build())
                .collect(Collectors.toList());
    }



}
