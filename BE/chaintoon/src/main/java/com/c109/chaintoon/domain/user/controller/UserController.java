package com.c109.chaintoon.domain.user.controller;

import com.c109.chaintoon.domain.user.dto.response.SearchUserResponseDto;
import com.c109.chaintoon.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // 회원 검색 (목록)
//    @GetMapping("/search")
//    public ResponseEntity<?> findUserByNickname(
//            @RequestParam(required = false) String search,
//            @RequestParam(required = false, defaultValue = "1") int page,
//            @RequestParam(required = false, defaultValue = "10") int pageSize) {
//        List<SearchUserResponseDto> list = userService.searchByNickname(search, page, pageSize);
//        return ResponseEntity.ok(list);
//    }


    // 회원 정보 조회


    // 회원 정보 수정

    // 팔로우

    // 언팔로우

    // 팔로우 조회

    // 팔로워 조회

    // 거래 내역 조회


}
