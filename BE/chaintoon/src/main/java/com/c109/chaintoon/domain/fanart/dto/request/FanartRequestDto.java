package com.c109.chaintoon.domain.fanart.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FanartRequestDto {
    @Positive(message = "웹툰 ID는 음수일 수 없습니다.")
    private Integer webtoonId;

    @NotBlank(message = "팬아트 이름을 입력하세요.")
    private String fanartName;

    @NotBlank(message = "팬아트 설명을 작성하세요.")
    private String description;
}
