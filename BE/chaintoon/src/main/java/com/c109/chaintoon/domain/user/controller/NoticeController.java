package com.c109.chaintoon.domain.user.controller;

import com.c109.chaintoon.domain.user.dto.response.NoticeListResponseDto;
import com.c109.chaintoon.domain.user.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping
    public ResponseEntity<?> getNoticeList(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        Integer userId = 0; // TODO: 유저 구현 후 변경
        NoticeListResponseDto noticeList = noticeService.getNoticeList(userId, page, pageSize);
        return new ResponseEntity<>(noticeList, HttpStatus.OK);
    }

    @PatchMapping("/{noticeId}")
    public ResponseEntity<?> readNotice(
            @PathVariable Integer noticeId
    ) {
        Integer userId = 0; // TODO: 유저 구현 후 변경
        noticeService.readNotice(userId, noticeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{noticeId}")
    public ResponseEntity<?> deleteNotice(
            @PathVariable Integer noticeId
    ) {
        Integer userId = 0; // TODO: 유저 구현 후 변경
        noticeService.deletedNotice(userId, noticeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
