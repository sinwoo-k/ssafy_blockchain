package com.c109.chaintoon.domain.webtoon.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WebtoonRequestDto {
    @NotBlank(message = "웹툰 이름을 입력하세요.")
    private String webtoonName;

    @NotBlank(message = "웹툰 장르를 입력하세요.")
    private String genre;

    @NotBlank(message = "웹툰 요약을 입력하세요.")
    private String summary;

    @Pattern(regexp = "[YN]", message = "2차 창작 여부는 Y/N으로 입력하세요.")
    private String adaptable;

    private List<String> tags;
}
