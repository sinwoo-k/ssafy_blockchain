package com.c109.chaintoon.common.s3.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.c109.chaintoon.common.exception.ServerException;
import com.c109.chaintoon.common.redis.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {
    private final AmazonS3 amazonS3;
    private final RedisService redisService;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${cloud.aws.s3.presigned-url.expiry}")
    private int presignedUrlExpiryMinutes;

    public String uploadFile(MultipartFile file, String pathPrefix) {
        try {
            String extension = getFileExtension(file.getOriginalFilename());
            String fileName = UUID.randomUUID().toString() + extension;
            String filePath = pathPrefix + "/" + fileName;

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            amazonS3.putObject(bucketName, filePath, file.getInputStream(), metadata);
            return filePath;
        } catch (IOException e) {
            throw new ServerException("파일 업로드가 실패했습니다.");
        }
    }

    public void deleteFile(String filePath) {
        amazonS3.deleteObject(bucketName, filePath);
        redisService.deleteValue(filePath);
    }

    public String getPresignedUrl(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) {
            return "";
        }

        // 1. Redis에서 캐시 조회
        String cachedUrl = (String) redisService.getValue(filePath);
        if (cachedUrl != null) {
            return cachedUrl;
        }

        // 2. 캐시 없으면 새로 생성
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, filePath)
                .withMethod(HttpMethod.GET)
                .withExpiration(getExpirationDate());

        URL presignedUrl = amazonS3.generatePresignedUrl(request);
        String urlString = presignedUrl.toString();

        // 3. Redis에 캐싱 (유효 시간 동기화)
        redisService.setValue(filePath, urlString, presignedUrlExpiryMinutes);

        return urlString;
    }

    private Date getExpirationDate() {
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime() + ((long) presignedUrlExpiryMinutes * 60 * 1000);
        expiration.setTime(expTimeMillis);
        return expiration;
    }

    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf("."));
    }
}
