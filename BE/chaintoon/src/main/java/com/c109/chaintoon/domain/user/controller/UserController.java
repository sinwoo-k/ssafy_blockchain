package com.c109.chaintoon.domain.user.controller;

import com.c109.chaintoon.common.jwt.JwtTokenProvider;
import com.c109.chaintoon.common.util.CookieUtils;
import com.c109.chaintoon.domain.user.dto.request.UserRequestDto;
import com.c109.chaintoon.domain.user.dto.response.FollowingResponseDto;
import com.c109.chaintoon.domain.user.dto.response.SearchUserResponseDto;
import com.c109.chaintoon.domain.user.dto.response.UserResponseDto;
import com.c109.chaintoon.domain.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final CookieUtils cookieUtils;

    // 회원 검색 (목록)
    @GetMapping("/search")
    public ResponseEntity<?> findUserByNickname(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        List<SearchUserResponseDto> list = userService.searchByNickname(keyword, page, pageSize);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    // id로 회원 정보 조회
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
        UserResponseDto user = userService.findUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // 회원 정보 수정
    @PatchMapping
    public ResponseEntity<?> updateUser(
            HttpServletRequest request,
            @RequestPart(value = "user", required = false) UserRequestDto userRequestDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "backgroundImage", required = false) MultipartFile backgroundImage
    ){
        Integer loginId = cookieUtils.getUserIdFromCookie(request);
        UserResponseDto user = userService.updateUser(loginId, userRequestDto, profileImage, backgroundImage);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // 닉네임 중복 확인
    @GetMapping("/isExist/{nickname}")
    public ResponseEntity<?> isExist(@PathVariable String nickname) {
        return ResponseEntity.ok(userService.checkNickname(nickname));
    }

    // 프로필 이미지 제거
    @DeleteMapping("/delete-profile")
    public ResponseEntity<?> deleteProfile(HttpServletRequest request) {
        Integer loginId = cookieUtils.getUserIdFromCookie(request);
        UserResponseDto user = userService.deleteProfile(loginId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // 배경 이미지 제거
    @DeleteMapping("/delete-background")
    public ResponseEntity<?> deleteBackground(HttpServletRequest request) {
        Integer loginId = cookieUtils.getUserIdFromCookie(request);
        UserResponseDto user = userService.deleteBackground(loginId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // 팔로우
    @PutMapping("/following/{userId}")
    public ResponseEntity<?> following(
            HttpServletRequest request,
            @PathVariable Integer userId) {
        Integer loginId = cookieUtils.getUserIdFromCookie(request);
        userService.addFollow(loginId, userId); //id: 로그인 중인(팔로우하는) 유저
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 언팔로우
    @DeleteMapping("/following/{userId}")
    public ResponseEntity<?> unfollowing(
            HttpServletRequest request,
            @PathVariable Integer userId) {
        Integer loginId = cookieUtils.getUserIdFromCookie(request);
        userService.removeFollow(loginId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 팔로우 조회
    @GetMapping("/following/{userId}")
    public ResponseEntity<?> getFollowingList(
            @PathVariable Integer userId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize) {
        List<FollowingResponseDto> followingList = userService.getFollowingList(userId, page, pageSize);
        return new ResponseEntity<>(followingList, HttpStatus.OK);
    }

    // 팔로워 조회
    @GetMapping("/followers/{userId}")
    public ResponseEntity<?> getFollowerList(
            @PathVariable Integer userId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize) {
        List<FollowingResponseDto> followerList = userService.getFollowerList(userId, page, pageSize);
        return new ResponseEntity<>(followerList, HttpStatus.OK);
    }

    // 거래 내역 조회


}
