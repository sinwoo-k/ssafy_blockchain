package com.c109.chaintoon.domain.comment.controller;

import com.c109.chaintoon.domain.comment.dto.request.CommentRequestDto;
import com.c109.chaintoon.domain.comment.dto.response.CommentResponseDto;
import com.c109.chaintoon.domain.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<?> getCommentList(
            @RequestParam Integer usageId,
            @RequestParam String usageType,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        List<CommentResponseDto> commentList = commentService.getCommentList(usageId, usageType, page, pageSize);
        return new ResponseEntity<>(commentList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody CommentRequestDto commentRequestDto) {
        commentRequestDto.setUserId(0); // TODO: user 구현 후 변경
        CommentResponseDto comment = commentService.addComment(commentRequestDto);
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<?> getReplyList(
            @PathVariable Integer commentId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        List<CommentResponseDto> replyList = commentService.getReplyList(commentId, page, pageSize);
        return new ResponseEntity<>(replyList, HttpStatus.OK);
    }

    @PatchMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Integer commentId,
            @RequestBody CommentRequestDto commentRequestDto
    ) {
        commentRequestDto.setUserId(0); // TODO: user 구현 후 변경
        commentRequestDto.setCommentId(commentId);
        CommentResponseDto comment = commentService.updateComment(commentRequestDto);
        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Integer commentId
    ) {
        Integer userId = 0; // TODO: user 구현 후 변경
        commentService.deleteComment(userId, commentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<?> likeComment(
            @PathVariable Integer commentId
    ) {
        Integer userId = 0; // TODO: user 구현 후 변경
        commentService.likeComment(userId, commentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{commentId}/like")
    public ResponseEntity<?> unlikeComment(
            @PathVariable Integer commentId
    ) {
        Integer userId = 0; // TODO: user 구현 후 변경
        commentService.unlikeComment(userId, commentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{commentId}/hate")
    public ResponseEntity<?> hateComment(
            @PathVariable Integer commentId
    ) {
        Integer userId = 0; // TODO: user 구현 후 변경
        commentService.hateComment(userId, commentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @DeleteMapping("/{commentId}/hate")
    public ResponseEntity<?> unhateComment(
            @PathVariable Integer commentId
    ) {
        Integer userId = 0; // TODO: user 구현 후 변경
        commentService.unhateComment(userId, commentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
