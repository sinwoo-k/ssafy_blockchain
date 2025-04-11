package com.c109.chaintoon.domain.comment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentRequestDto {
    @Positive(message = "사용처 ID는 음수일 수 없습니다.")
    private Integer usageId;

    @NotBlank(message = "사용처를 입력하세요.")
    private String type;

    @Positive(message = "부모 댓글 ID는 음수일 수 없습니다.")
    private Integer parentId;

    @NotBlank(message = "댓글 내용을 입력하세요.")
    private String content;
}
