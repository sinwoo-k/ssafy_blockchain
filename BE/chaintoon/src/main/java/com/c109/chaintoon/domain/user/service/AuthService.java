package com.c109.chaintoon.domain.user.service;

import com.c109.chaintoon.common.email.service.EmailService;
import com.c109.chaintoon.common.exception.ServerException;
import com.c109.chaintoon.common.jwt.JwtTokenProvider;
import com.c109.chaintoon.common.oauth.AuthCodeGenerator;
import com.c109.chaintoon.common.redis.service.RedisService;
import com.c109.chaintoon.domain.user.dto.request.SsoUserRequestDto;
import com.c109.chaintoon.domain.user.entity.User;
import com.c109.chaintoon.domain.user.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RedisService redisService;
    private final EmailService emailService;
    private final JwtTokenProvider jwtTokenProvider;

    // 인증 코드 만료 시간 5분
    private static final long AUTH_CODE_EXPIRE_MINUTES = 5;

    // 이메일을 받아 인증 코드 작성
    @Transactional
    public void emailLogin(String email) {
        // 인증 코드 생성 (매개변수는 인증 코드 자릿수)
        String authCode = AuthCodeGenerator.generateCode(12);

        // Redis에 인증 코드 저장
        String redisKey = "auth:code:" + email;
        redisService.setValue(redisKey, authCode, AUTH_CODE_EXPIRE_MINUTES);

        // 이메일 전송
        String subject = "이메일 로그인 인증 코드";
        String content = "인증 코드: " + authCode;

        try {
            emailService.sendMail(subject, email, content);
        } catch (MessagingException e) {
            throw new ServerException("이메일 전송이 실패했습니다.");
        }
    }

    // 인증 코드 검증 후 토큰 발급
    @Transactional
    public String verifyEmailCode(String email, String inputCode) {
        // Redis에서 저장된 인증 코드 가져오기
        String redisKey = "auth:code:" + email;
        Object storedCode = redisService.getValue(redisKey);

        if (storedCode == null || !storedCode.toString().replaceAll("^\"|\"$", "").equals(inputCode)) {
            throw new IllegalArgumentException("잘못된 인증 코드이거나 만료되었습니다.");
        }

        // 인증 코드 사용 후 삭제
        redisService.deleteValue(redisKey);

        // 사용자 정보 확인 (회원이 아니면 자동 가입 가능)
        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user = optionalUser.orElseGet(() -> autoRegisterUser(email));

        // JWT 토큰 발급 및 반환
        return jwtTokenProvider.createAccessToken(user.getId(), "USER");
    }

    // 회원이 아닐 경우 자동 회원가입 (이메일만 등록)
    private User autoRegisterUser(String email) {
        Random rand = new Random();
        int randomNumber = rand.nextInt(900000) + 100000;
        String nickname="Unnamed"+randomNumber;

        while(userRepository.existsByNicknameAndDeleted(nickname, "N")){
            randomNumber = rand.nextInt(900000) + 100000;
            nickname = "Unnamed" + randomNumber;
        }

        User newUser = User.builder()
                .email(email)
                .nickname(nickname)
                .joinDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                .following(0)
                .follower(0)
                .introduction("")
                .deleted("N")
                .status("Y")
                .backgroundImage("")
                .profileImage("")
                .build();

        return userRepository.save(newUser);
    }

    public Integer saveUserIfAbsent(SsoUserRequestDto userRequest) {
        // 이메일을 기준으로 사용자 조회
        Optional<User> foundUser = this.userRepository.findByEmail(userRequest.getLoginId());

        if (foundUser.isPresent()) {
            // 사용자가 이미 존재하는 경우
            User user = foundUser.get();
            if (!user.getId().equals(userRequest.getUserId())) {
                // 동일한 이메일이 다른 사용자에게 등록된 경우 예외 처리
                throw new ServerException("동일한 Email이 다른 사용자에 등록되어 있어 등록이 불가능합니다.\n" + "userId: " + userRequest.getUserId() + ", email: " + userRequest.getLoginId());
            }
            return user.getId(); // 기존 사용자의 이메일 반환
        } else {
            // 사용자가 존재하지 않는 경우 새로 생성
            Random rand = new Random();
            int randomNumber = rand.nextInt(900000) + 100000;
            String nickname = "Unnamed" + randomNumber;

            // 닉네임 중복 체크 및 고유 닉네임 생성
            while (userRepository.existsByNicknameAndDeleted(nickname, "N")) {
                randomNumber = rand.nextInt(900000) + 100000;
                nickname = "Unnamed" + randomNumber;
            }

            // 새로운 사용자 생성 및 초기화
            User newUser = User.builder()
                    .email(userRequest.getLoginId())
                    .nickname(nickname)
                    .joinDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                    .following(0)
                    .follower(0)
                    .introduction("")
                    .deleted("N")
                    .status("Y")
                    .backgroundImage("")
                    .profileImage("")
                    .build();

            // 사용자 저장
            newUser = this.userRepository.save(newUser);

            return newUser.getId(); // 새로 생성된 사용자의 이메일 반환
        }
    }

}
