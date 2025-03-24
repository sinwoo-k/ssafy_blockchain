package com.c109.chaintoon.domain.comment.controller;

import com.c109.chaintoon.domain.comment.dto.request.CommentRequestDto;
import com.c109.chaintoon.domain.comment.dto.response.CommentResponseDto;
import com.c109.chaintoon.domain.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            @RequestParam String type,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        List<CommentResponseDto> commentList = commentService.getCommentList(usageId, type, page, pageSize);
        return new ResponseEntity<>(commentList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> addComment(
            @AuthenticationPrincipal Integer userId,
            @RequestBody CommentRequestDto commentRequestDto
    ) {
        commentRequestDto.setUserId(userId);
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
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer commentId,
            @RequestBody CommentRequestDto commentRequestDto
    ) {
        commentRequestDto.setUserId(userId);
        commentRequestDto.setCommentId(commentId);
        CommentResponseDto comment = commentService.updateComment(commentRequestDto);
        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer commentId
    ) {
        commentService.deleteComment(userId, commentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<?> likeComment(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer commentId
    ) {
        commentService.likeComment(userId, commentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{commentId}/like")
    public ResponseEntity<?> unlikeComment(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer commentId
    ) {
        commentService.unlikeComment(userId, commentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{commentId}/hate")
    public ResponseEntity<?> hateComment(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer commentId
    ) {
        commentService.hateComment(userId, commentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @DeleteMapping("/{commentId}/hate")
    public ResponseEntity<?> unhateComment(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer commentId
    ) {
        commentService.unhateComment(userId, commentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
