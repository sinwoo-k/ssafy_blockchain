package com.c109.chaintoon.common.email.service;

import lombok.RequiredArgsConstructor;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void sendMail(String title, String recipient, String content) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
        mimeMessageHelper.setTo(recipient); // 메일 수신자
        mimeMessageHelper.setSubject(title); // 메일 제목
        mimeMessageHelper.setText(content); // 메일 본문 내용, HTML 여부
        javaMailSender.send(mimeMessage);
    }
}