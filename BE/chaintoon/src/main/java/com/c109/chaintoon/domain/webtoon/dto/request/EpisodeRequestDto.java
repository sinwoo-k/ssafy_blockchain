package com.c109.chaintoon.domain.webtoon.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EpisodeRequestDto {
    @Positive(message = "회원 ID는 음수일 수 없습니다.")
    private Integer webtoonId;

    @NotBlank(message = "에피소드 이름을 입력하세요.")
    private String episodeName;

    @NotBlank(message = "작가 코멘트를 입력하세요.")
    private String writerComment;

    @Pattern(regexp = "[YN]", message = "댓글 허용 여부는 Y/N으로 입력하세요.")
    private String commentable;
}
