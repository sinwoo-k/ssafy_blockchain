package com.c109.chaintoon.domain.comment.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentUpdateDto {
    @NotBlank(message = "댓글 내용을 입력하세요.")
    private String content;
}
