package com.c109.chaintoon.domain.comment.service;

import com.c109.chaintoon.common.exception.DuplicatedException;
import com.c109.chaintoon.common.exception.UnauthorizedAccessException;
import com.c109.chaintoon.common.s3.service.S3Service;
import com.c109.chaintoon.domain.comment.code.CommentType;
import com.c109.chaintoon.domain.comment.dto.request.CommentRequestDto;
import com.c109.chaintoon.domain.comment.dto.request.CommentUpdateDto;
import com.c109.chaintoon.domain.comment.dto.response.CommentResponseDto;
import com.c109.chaintoon.domain.comment.entity.Comment;
import com.c109.chaintoon.domain.comment.entity.CommentPreference;
import com.c109.chaintoon.domain.comment.exception.CommentNotFoundException;
import com.c109.chaintoon.domain.comment.repository.CommentPreferenceRepository;
import com.c109.chaintoon.domain.comment.repository.CommentRepository;
import com.c109.chaintoon.domain.fanart.repository.FanartRepository;
import com.c109.chaintoon.domain.user.entity.User;
import com.c109.chaintoon.domain.user.exception.UserIdNotFoundException;
import com.c109.chaintoon.domain.user.repository.UserRepository;
import com.c109.chaintoon.domain.webtoon.repository.EpisodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {


    private final CommentRepository commentRepository;
    private final CommentPreferenceRepository commentPreferenceRepository;
    private final UserRepository userRepository;
    private final EpisodeRepository episodeRepository;
    private final FanartRepository fanartRepository;
    private final S3Service s3Service;

    private CommentResponseDto convertToDto(Comment comment) {
        return convertToDto(comment, null);
    }

    private CommentResponseDto convertToDto(Comment comment, Integer userId) {
        // 날짜와 시간을 포맷팅
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

        User writer = userRepository.findById(comment.getUserId()).orElseThrow(
                () -> new UserIdNotFoundException(comment.getUserId())
        );

        String hasLiked = "N";
        String hasHated = "N";
        if (userId != null) {
            CommentPreference commentPreference = commentPreferenceRepository
                    .findByCommentIdAndUserId(comment.getCommentId(), userId)
                    .orElse(null);
            if (commentPreference != null && "Y".equals(commentPreference.getLiked())) {
                hasLiked = "Y";
            }
            else if (commentPreference != null && "N".equals(commentPreference.getLiked())) {
                hasHated = "Y";
            }
        }

        return CommentResponseDto.builder()
                .commentId(comment.getCommentId())
                .userId(comment.getUserId())
                .nickname(writer.getNickname())
                .profileImage(s3Service.getPresignedUrl(writer.getProfileImage()))
                .usageId(comment.getUsageId())
                .type(comment.getType())
                .parentId(comment.getParentId())
                .content(comment.getContent())
                .hasLiked(hasLiked)
                .hasHated(hasHated)
                .createDate(comment.getCreatedAt().format(dateFormatter)) // updated_at을 날짜 형식으로 변환
                .createTime(comment.getCreatedAt().format(timeFormatter)) // updated_at을 시간 형식으로 변환
                .replyCount(comment.getReplyCount())
                .likeCount(comment.getLikeCount())
                .hateCount(comment.getHateCount())
                .build();
    }

    @Transactional(readOnly = true)
    public List<CommentResponseDto> getCommentList(Integer userId, Integer usageId, String type, int page, int pageSize) {
        // 페이징 처리를 위한 Pageable 객체 생성
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        // usageId, type 일치하고 삭제되지 않은 댓글 목록 조회
        Page<Comment> commentPage = commentRepository
                .findByUsageIdAndTypeAndParentIdAndDeleted(usageId, type, 0,"N", pageable);

        // Comment 엔티티 Dto 변환
        return commentPage.getContent().stream()
                .map(comment -> convertToDto(comment, userId))
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponseDto addComment(Integer userId, CommentRequestDto commentRequestDto) {
        Integer parentId = commentRequestDto.getParentId();
        // 대댓글인 경우
        if (parentId != 0) {
            // 부모 댓글 조회
            Comment parentComment = commentRepository.findByCommentIdAndDeleted(parentId, "N")
                    .orElseThrow(() -> new IllegalArgumentException("부모댓글이 없거나 삭제되었습니다."));

            // 대댓글 수 증가
            parentComment.setReplyCount(parentComment.getReplyCount() + 1);
            commentRepository.save(parentComment);
        }

        // Dto 엔티티로 변환
        Comment comment = Comment.builder()
                .userId(userId)
                .usageId(commentRequestDto.getUsageId())
                .type(commentRequestDto.getType())
                .parentId(commentRequestDto.getParentId())
                .content(commentRequestDto.getContent())
                .build();

        if (CommentType.EPISODE.getValue().equals(commentRequestDto.getType())) {
            episodeRepository.incrementCommentCount(commentRequestDto.getUsageId());
        }
        else if (CommentType.FANART.getValue().equals(commentRequestDto.getType())) {
            fanartRepository.incrementCommentCount(commentRequestDto.getUsageId());
        }
        else {
            throw new IllegalArgumentException("존재하지 않는 댓글 타입입니다.");
        }

        // 댓글 저장
        Comment savedComment = commentRepository.save(comment);

        // 저장된 댓글 Dto 변환 후 반환
        return convertToDto(savedComment, userId);
    }

    @Transactional(readOnly = true)
    public List<CommentResponseDto> getReplyList(Integer userId, Integer commentId, int page, int pageSize) {
        // 기존 댓글 조회
        commentRepository.findByCommentIdAndDeleted(commentId, "N")
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        // 페이징 처리를 위한 Pageable 객체 생성
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        // 삭제되지 않은 대댓글 목록 조회
        Page<Comment> commentPage = commentRepository.findByParentIdAndDeleted(commentId, "N", pageable);

        // Comment 엔티티 Dto 변환
        return commentPage.getContent().stream()
                .map(comment -> convertToDto(comment, userId))
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponseDto updateComment(Integer userId, Integer commentId, CommentUpdateDto commentUpdateDto) {
        // 기존 댓글 조회
        Comment comment = commentRepository.findByCommentIdAndDeleted(commentId, "N")
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        // 댓글 수정 권한 확인
        if (!comment.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("댓글 수정 권한이 없습니다.");
        }

        Integer parentId = comment.getParentId();
        // 대댓글인 경우
        if (parentId != 0) {
            // 부모 댓글 조회
            commentRepository.findByCommentIdAndDeleted(parentId, "N")
                    .orElseThrow(() -> new IllegalArgumentException("부모댓글이 없거나 삭제되었습니다."));
        }

        // 댓글 내용 수정
        comment.setContent(commentUpdateDto.getContent());
        Comment savedComment = commentRepository.save(comment);


        // Dto 변환 후 반환
        return convertToDto(savedComment, userId);
    }

    @Transactional
    public void deleteComment(Integer userId, Integer commentId) {
        // 기존 댓글 조회
        Comment comment = commentRepository.findByCommentIdAndDeleted(commentId, "N")
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        // 댓글 삭제 권한 확인
        if (!comment.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("댓글 삭제 권한이 없습니다.");
        }

        Integer parentId = comment.getParentId();
        // 대댓글인 경우
        if (parentId != 0) {
            // 부모 댓글 조회
            Comment parentComment = commentRepository.findByCommentIdAndDeleted(parentId, "N")
                    .orElseThrow(() -> new IllegalArgumentException("부모댓글이 없거나 삭제되었습니다."));

            // 대댓글 수 감소
            parentComment.setReplyCount(parentComment.getReplyCount() - 1);
            commentRepository.save(parentComment);
        }

        // 사용처 댓글 수 감소
        if (CommentType.EPISODE.getValue().equals(comment.getType())) {
            episodeRepository.decrementCommentCount(comment.getUsageId());
        }
        else if (CommentType.FANART.getValue().equals(comment.getType())) {
            fanartRepository.decrementCommentCount(comment.getUsageId());
        }

        // 댓글 소프트 삭제
        comment.setDeleted("Y");
        commentRepository.save(comment);
    }
    
    @Transactional
    public void likeComment(Integer userId, Integer commentId) {
        // 기존 댓글 조회
        Comment comment = commentRepository.findByCommentIdAndDeleted(commentId, "N")
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        // 대댓글인 경우 부모 댓글 조회
        Integer parentId = comment.getParentId();
        if (comment.getParentId() != 0) {
            commentRepository.findByCommentIdAndDeleted(parentId, "N")
                    .orElseThrow(() -> new IllegalArgumentException("부모댓글이 없거나 삭제되었습니다."));
        }

        // 댓글 좋아요/싫어요 여부 확인
        CommentPreference commentPreference = commentPreferenceRepository
                .findByCommentIdAndUserId(commentId, userId).orElse(null);

        if (commentPreference == null) {
            // 좋아요 저장
            commentPreference = new CommentPreference();
            commentPreference.setCommentId(commentId);
            commentPreference.setUserId(userId);
            commentPreference.setLiked("Y");
            commentPreferenceRepository.save(commentPreference);
            comment.setLikeCount(comment.getLikeCount() + 1);
            commentRepository.save(comment);
        }
        else if ("Y".equals(commentPreference.getLiked())) {
            // 중복 요청
            throw new DuplicatedException("이미 '좋아요'한 댓글입니다.");
        }
        else {
            // 잘못된 요청
            throw new IllegalArgumentException("'싫어요'한 댓글입니다. 취소 후 수정해주세요.");
        }

    }

    @Transactional
    public void unlikeComment(Integer userId, Integer commentId) {
        // 기존 댓글 조회
        Comment comment = commentRepository.findByCommentIdAndDeleted(commentId, "N")
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        // 대댓글인 경우 부모 댓글 조회
        Integer parentId = comment.getParentId();
        if (comment.getParentId() != 0) {
            commentRepository.findByCommentIdAndDeleted(parentId, "N")
                    .orElseThrow(() -> new IllegalArgumentException("부모댓글이 없거나 삭제되었습니다."));
        }

        // 댓글 좋아요/싫어요 여부 확인
        CommentPreference commentPreference = commentPreferenceRepository
                .findByCommentIdAndUserId(commentId, userId).orElse(null);

        if (commentPreference == null) {
            // 중복된 요청
            throw new DuplicatedException("'좋아요'한 적 없는 댓글입니다.");
        }
        else if ("Y".equals(commentPreference.getLiked())) {
            // 레코드 삭제
            commentPreferenceRepository.delete(commentPreference);
            comment.setLikeCount(comment.getLikeCount() - 1);
            commentRepository.save(comment);
        }
        else {
            // 잘못된 요청
            throw new IllegalArgumentException("'싫어요'한 댓글입니다. 취소 후 수정해주세요.");
        }
    }

    @Transactional
    public void hateComment(Integer userId, Integer commentId) {
        // 기존 댓글 조회
        Comment comment = commentRepository.findByCommentIdAndDeleted(commentId, "N")
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        // 대댓글인 경우 부모 댓글 조회
        Integer parentId = comment.getParentId();
        if (comment.getParentId() != 0) {
            commentRepository.findByCommentIdAndDeleted(parentId, "N")
                    .orElseThrow(() -> new IllegalArgumentException("부모댓글이 없거나 삭제되었습니다."));
        }

        // 댓글 좋아요/싫어요 여부 확인
        CommentPreference commentPreference = commentPreferenceRepository
                .findByCommentIdAndUserId(commentId, userId).orElse(null);

        if (commentPreference == null) {
            // 싫어요 저장
            commentPreference = new CommentPreference();
            commentPreference.setCommentId(commentId);
            commentPreference.setUserId(userId);
            commentPreference.setLiked("N");
            commentPreferenceRepository.save(commentPreference);
            comment.setHateCount(comment.getHateCount() + 1);
            commentRepository.save(comment);
        }
        else if ("N".equals(commentPreference.getLiked())) {
            // 중복된 요청
            throw new DuplicatedException("이미 '싫어요'한 댓글입니다.");
        }
        else {
            // 잘못된 요청
            throw new IllegalArgumentException("'좋아요'한 댓글입니다. 취소 후 수정해주세요.");
        }
    }

    public void unhateComment(Integer userId, Integer commentId) {
        // 기존 댓글 조회
        Comment comment = commentRepository.findByCommentIdAndDeleted(commentId, "N")
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        // 대댓글인 경우 부모 댓글 조회
        Integer parentId = comment.getParentId();
        if (comment.getParentId() != 0) {
            commentRepository.findByCommentIdAndDeleted(parentId, "N")
                    .orElseThrow(() -> new IllegalArgumentException("부모댓글이 없거나 삭제되었습니다."));
        }

        // 댓글 좋아요/싫어요 여부 확인
        CommentPreference commentPreference = commentPreferenceRepository
                .findByCommentIdAndUserId(commentId, userId).orElse(null);

        if (commentPreference == null) {
            // 중복된 요청
            throw new DuplicatedException("'싫어요'한 적 없는 댓글입니다.");
        }
        else if ("N".equals(commentPreference.getLiked())) {
            // 레코드 삭제
            commentPreferenceRepository.delete(commentPreference);
            comment.setHateCount(comment.getHateCount() - 1);
            commentRepository.save(comment);
        }
        else {
            // 잘못된 요청
            throw new IllegalArgumentException("'좋아요'한 댓글입니다. 취소 후 수정해주세요.");
        }
    }
}
