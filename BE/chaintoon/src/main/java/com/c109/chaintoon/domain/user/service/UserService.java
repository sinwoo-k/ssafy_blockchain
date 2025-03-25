package com.c109.chaintoon.domain.user.service;

import com.c109.chaintoon.common.exception.UnauthorizedAccessException;
import com.c109.chaintoon.common.s3.service.S3Service;
import com.c109.chaintoon.domain.user.dto.request.UserRequestDto;
import com.c109.chaintoon.domain.user.dto.response.FollowingResponseDto;
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

    // 회원 정보 수정
    public UserResponseDto updateUser(Integer userId, UserRequestDto userRequestDto, MultipartFile profileImage, MultipartFile backgroundImage) {
        // 기존 유저 조회
        User user = userRepository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(userId));
        
        // 수정 권한 없음
        if (!userRequestDto.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("회원 수정 권한이 없습니다.");
        }

        // 프로필 이미지 업데이트
        if (profileImage != null && !profileImage.isEmpty()) {
            if(userRequestDto.getProfileImage() != null) {
                s3Service.deleteFile(user.getProfileImage());
            }
            String profileUrl = uploadProfile(userId, profileImage);
            user.setProfileImage(profileUrl);
        }

        // 배경 이미지 업데이트
        if(backgroundImage != null && !backgroundImage.isEmpty()) {
            if (user.getBackgroundImage() != null) {
                s3Service.deleteFile(user.getBackgroundImage());
            }
            String backgroundUrl = uploadBackground(userId, backgroundImage);
            user.setBackgroundImage(backgroundUrl);
        }

        // 회원 정보 업데이트
        user.setNickname(userRequestDto.getNickname());
        user.setIntroduction(userRequestDto.getIntroduction());

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

    // 프로필 이미지 업로드
    private String uploadProfile(Integer userId, MultipartFile file){
        return s3Service.uploadFile(file, "user/" + userId + "/profile");
    }

    // 배경 이미지 업로드
    private String uploadBackground(Integer userId, MultipartFile file){
        return s3Service.uploadFile(file, "user/" + userId + "/background");
    }

    // 닉네임 중복 확인
    @Transactional(readOnly = true)
    public boolean checkNickname(String nickname){
        return userRepository.existsByNicknameAndDeleted(nickname, "N");
    }

    // 프로필 이미지 제거
    @Transactional
    public UserResponseDto deleteProfile(Integer userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(userId));

        if(user.getProfileImage() != null) {
            s3Service.deleteFile(user.getProfileImage());
        }
        user.setProfileImage(null);
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

    // 배경 이미지 제거
    @Transactional
    public UserResponseDto deleteBackground(Integer userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(userId));

        if(user.getBackgroundImage() != null) {
            s3Service.deleteFile(user.getBackgroundImage());
        }
        user.setBackgroundImage(null);
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

    // 팔로우
    @Transactional
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
                .map(user -> {
                    return FollowingResponseDto.builder()
                            .profile(user.getProfileImage())
                            .userId(user.getId())
                            .nickname(user.getNickname())
                            .build();
                })
                .collect(Collectors.toList());
    }



}
