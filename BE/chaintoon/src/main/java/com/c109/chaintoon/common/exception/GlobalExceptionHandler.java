package com.c109.chaintoon.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 400 Bad Request - DTO 검증 실패
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException e) {
        Map<String, String> fieldErrors = new HashMap<>();

        e.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Validation Failed");
        response.put("messages", fieldErrors);

        return ResponseEntity.badRequest().body(response);
    }

    // 400 Bad Request - RequestParam 검증 실패
    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<Map<String, Object>> handleHandlerMethodValidationException(HandlerMethodValidationException e) {
        Map<String, String> fieldErrors = e.getAllValidationResults().stream()
                .collect(Collectors.toMap(
                        result -> result.getMethodParameter().getParameterName(),
                        result -> result.getResolvableErrors().get(0).getDefaultMessage()
                ));

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Validation Failed");
        response.put("messages", fieldErrors);

        return ResponseEntity.badRequest().body(response);
    }

    // 400 Bad Request - 필수 파라미터 누락
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, String>> handleMissingParam(MissingServletRequestParameterException e) {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Missing Parameter",
                String.format("필수 파라미터 '%s'가 누락되었습니다.", e.getParameterName())
        );
    }

    // 400 Bad Request - 필수 경로 변수 누락
    @ExceptionHandler(MissingPathVariableException.class)
    public ResponseEntity<Map<String, String>> handleMissingPathVariable(MissingPathVariableException e) {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Missing Path Variable",
                String.format("경로 변수 '%s'가 누락되었습니다.", e.getVariableName())
        );
    }

    // 400 Bad Request - 필수 파일/파트 누락
    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<Map<String, String>> handleMissingPart(MissingServletRequestPartException e) {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Missing Request Part",
                String.format("필수 요청 파트 '%s'가 누락되었습니다.", e.getRequestPartName())
        );
    }

    // 400 Bad Request - JSON 파싱 오류
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleHttpMessageNotReadable() {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Invalid JSON Format",
                "요청 본문의 JSON 형식이 잘못되었습니다."
        );
    }

    // 400 Bad Request - 타입 불일치
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        String requiredType = e.getRequiredType() != null ? e.getRequiredType().getSimpleName() : "unknown";
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Type Mismatch",
                String.format("'%s' 파라미터는 %s 타입이어야 합니다.", e.getName(), requiredType)
        );
    }

    // 400 Bad Request - 일반적인 잘못된 요청
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException e) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Invalid Request", e.getMessage());
    }

    // 403 FORBIDDEN - 접근 권한 없음
    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<Map<String, String>> handleUnauthorized(UnauthorizedAccessException e) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Forbidden", e.getMessage());
    }

    // 404 Not Found - 리소스 없음
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(NotFoundException e) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Not Found", e.getMessage());
    }

    // 409 Conflict - 중복 데이터
    @ExceptionHandler(DuplicatedException.class)
    public ResponseEntity<Map<String, String>> handleDuplicated(DuplicatedException e) {
        return buildErrorResponse(HttpStatus.CONFLICT, "Conflict", e.getMessage());
    }

    // 413 Payload Too Large - 파일 크기 초과
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> handleMaxSizeException() {
        return buildErrorResponse(
                HttpStatus.PAYLOAD_TOO_LARGE,
                "Payload Too Large",
                "업로드 가능한 파일 크기를 초과하였습니다. 최대 100MB 까지 업로드 가능합니다."
        );
    }

    // 500 Internal Server Error - 서버 예외
    @ExceptionHandler(ServerException.class)
    public ResponseEntity<Map<String, String>> handleServerException(ServerException e) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", e.getMessage());
    }

    // 500 Internal Server Error - 알 수 없는 예외
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleUnknownException(Exception e) {
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal Server Error",
                "알 수 없는 에러가 발생했습니다: " + e.getMessage()
        );
    }

    // 공통 응답 생성 메서드
    private ResponseEntity<Map<String, String>> buildErrorResponse(HttpStatus status, String error, String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", error);
        response.put("message", message);
        return ResponseEntity.status(status).body(response);
    }
}