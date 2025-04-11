package com.c109.chaintoon.domain.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {
    @NotBlank
    private String nickname;

    private String introduction = "";

    private String url = "";

}
