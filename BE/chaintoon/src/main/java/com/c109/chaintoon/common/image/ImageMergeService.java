package com.c109.chaintoon.common.image;

import com.c109.chaintoon.common.exception.NotFoundException;
import com.c109.chaintoon.common.exception.ServerException;
import com.c109.chaintoon.common.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class ImageMergeService {

    private final S3Service s3Service;

    // URL 리스트의 이미지를 읽어와 BufferedImage 리스트로 반환
    public List<BufferedImage> loadImages(List<String> imageUrls) throws IOException {
        List<BufferedImage> images = new ArrayList<>();
        for (String url : imageUrls) {
            BufferedImage img = ImageIO.read(new URL(url));
            if (img != null) {
                images.add(img);
            }
        }
        return images;
    }

    // 여러 이미지를 세로로 합치는 메서드
    public BufferedImage mergeImagesVertically(List<BufferedImage> images) {
        int maxWidth = images.stream().mapToInt(BufferedImage::getWidth).max().orElse(0);
        int totalHeight = images.stream().mapToInt(BufferedImage::getHeight).sum();

        // 새 이미지를 생성 (투명도를 지원하는 ARGB 타입 사용)
        BufferedImage mergedImage = new BufferedImage(maxWidth, totalHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = mergedImage.createGraphics();

        int currentY = 0;
        for (BufferedImage img : images) {
            g.drawImage(img, 0, currentY, null);
            currentY += img.getHeight();
        }
        g.dispose();
        return mergedImage;
    }

    // 결과 이미지를 파일로 저장하는 메서드 (테스트나 로컬 저장용)
    public void saveImage(BufferedImage image, String outputPath) throws IOException {
        ImageIO.write(image, "png", new File(outputPath));
    }

    /**
     * 여러 이미지 URL을 받아서 세로로 병합한 후 S3에 업로드하고 S3 key를 반환하는 메서드
     *
     * @param imageUrls  이미지 URL 리스트
     * @param pathPrefix S3 업로드 시 사용할 폴더 경로(prefix)
     * @return 업로드된 이미지의 S3 key
     */
    public String mergeAndUploadNftImage(List<String> imageUrls, String pathPrefix) {
        try {
            // 1. 이미지 URL로부터 BufferedImage 목록 생성
            List<BufferedImage> images = loadImages(imageUrls);
            if (images.isEmpty()) {
                throw new NotFoundException("합칠 이미지가 존재하지 않습니다.");
            }

            // 2. BufferedImage들을 세로로 병합
            BufferedImage mergedImage = mergeImagesVertically(images);

            // 3. 병합된 이미지를 메모리(ByteArrayOutputStream)에 기록 (PNG 포맷)
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(mergedImage, "png", baos);
            byte[] imageBytes = baos.toByteArray();

            // 4. Byte 배열을 운영 환경에서 사용할 수 있는 MultipartFile 구현체로 변환
            MultipartFile multipartFile = new ByteArrayMultipartFile("file", "merged.png", "image/png", imageBytes);

            // 5. S3Service의 uploadFile 메서드를 호출하여 업로드 후 S3 key 반환
            return s3Service.uploadFile(multipartFile, pathPrefix);
        } catch (IOException e) {
            throw new ServerException("이미지 병합 및 업로드 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 운영 환경에서 사용할 수 있는 ByteArray 기반 MultipartFile 구현체
     */

    public class ByteArrayMultipartFile implements MultipartFile {
        private final String name;
        private final String originalFilename;
        private final String contentType;
        private final byte[] content;

        public ByteArrayMultipartFile(String name, String originalFilename, String contentType, byte[] content) {
            this.name = name;
            this.originalFilename = originalFilename;
            this.contentType = contentType;
            this.content = content;
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public String getOriginalFilename() {
            return originalFilename;
        }

        @Override
        public String getContentType() {
            return contentType;
        }

        @Override
        public boolean isEmpty() {
            return content == null || content.length == 0;
        }

        @Override
        public long getSize() {
            return content.length;
        }

        @Override
        public byte[] getBytes() throws IOException {
            return content;
        }

        @Override
        public ByteArrayInputStream getInputStream() throws IOException {
            return new ByteArrayInputStream(content);
        }

        @Override
        public void transferTo(File dest) throws IOException {
            throw new UnsupportedOperationException("transferTo not supported.");
        }
    }
}
