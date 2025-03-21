package com.c109.chaintoon.domain.user.controller;

import com.c109.chaintoon.domain.user.dto.response.NoticeListResponseDto;
import com.c109.chaintoon.domain.user.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping
    public ResponseEntity<?> getNoticeList(
            @AuthenticationPrincipal Integer userId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        NoticeListResponseDto noticeList = noticeService.getNoticeList(userId, page, pageSize);
        return new ResponseEntity<>(noticeList, HttpStatus.OK);
    }

    @PatchMapping("/{noticeId}")
    public ResponseEntity<?> readNotice(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer noticeId
    ) {
        noticeService.readNotice(userId, noticeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{noticeId}")
    public ResponseEntity<?> deleteNotice(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer noticeId
    ) {
        noticeService.deletedNotice(userId, noticeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
