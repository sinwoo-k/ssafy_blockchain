package com.c109.chaintoon.domain.user.controller;

import com.c109.chaintoon.domain.user.dto.request.UserRequestDto;
import com.c109.chaintoon.domain.user.dto.response.SearchUserResponseDto;
import com.c109.chaintoon.domain.user.dto.response.UserResponseDto;
import com.c109.chaintoon.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

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
    @PatchMapping("/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer userId,
            @RequestPart(value = "user", required = false) UserRequestDto userRequestDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "backgroundImage", required = false) MultipartFile backgroundImage
    ){
        UserResponseDto user = userService.updateUser(userId, userRequestDto, profileImage, backgroundImage);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // 팔로우

    // 언팔로우

    // 팔로우 조회

    // 팔로워 조회

    // 거래 내역 조회


}
