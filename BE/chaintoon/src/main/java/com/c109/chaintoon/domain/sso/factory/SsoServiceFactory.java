package com.c109.chaintoon.domain.sso.factory;

import com.c109.chaintoon.domain.sso.enums.SsoProvider;
import com.c109.chaintoon.domain.sso.service.SsafySsoServiceImpl;
import com.c109.chaintoon.domain.sso.service.SsoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class SsoServiceFactory {

    private final SsafySsoServiceImpl ssafySsoService;

    public SsoService getSsoService(String providerType) {
        if (StringUtils.isEmpty(providerType)) {
            throw new IllegalArgumentException("Provider cannot be null");
        }

        // SsoProvider 열거형의 fromType 메서드를 호출하여 providerType 문자열을 SsoProvider로 변환
        // 변환된 provider 값을 기준으로 switch 구문을 사용하여 적절한 SsoService 객체 반환
        SsoProvider provider = SsoProvider.fromType(providerType);
        return switch (provider) {
            case SSAFY -> ssafySsoService;
            default -> throw new IllegalArgumentException("Unsupported provider: " + provider);
        };
    }
}
