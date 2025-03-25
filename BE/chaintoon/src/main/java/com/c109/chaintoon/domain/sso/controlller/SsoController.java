package com.c109.chaintoon.domain.sso.controlller;

import com.c109.chaintoon.common.jwt.JwtTokenProvider;
import com.c109.chaintoon.domain.sso.factory.SsoServiceFactory;
import com.c109.chaintoon.domain.sso.payload.SsoAuthToken;
import com.c109.chaintoon.domain.sso.service.SsoService;
import com.c109.chaintoon.domain.user.dto.request.SsoUserRequestDto;
import com.c109.chaintoon.domain.user.service.AuthService;
import com.c109.chaintoon.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sso")
@RequiredArgsConstructor
public class SsoController {

    private final SsoServiceFactory ssoServiceFactory;
    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/providers/{provider}/authorization-uri")
    public String redirectAuthCodeRequestUrl(@PathVariable String provider) {
        SsoService ssoService = ssoServiceFactory.getSsoService(provider);
        return ssoService.getAuthCodeRequestUrl();
    }

    @PostMapping("/providers/{provider}/login")
    public ResponseEntity<String> ssoLogin(@PathVariable String provider, @RequestBody String code) {
        SsoService ssoService = ssoServiceFactory.getSsoService(provider);
        SsoAuthToken ssoAuthToken = ssoService.getSsoAuthToken(code);
        SsoUserRequestDto userRequest = ssoService.getLoginUserInfo(ssoAuthToken);
        Integer loginId = this.authService.saveUserIfAbsent(userRequest);

        return ResponseEntity.ok(jwtTokenProvider.createAccessToken(loginId, "USER"));
    }

}
