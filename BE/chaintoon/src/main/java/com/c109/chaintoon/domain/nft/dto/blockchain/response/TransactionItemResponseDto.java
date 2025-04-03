package com.c109.chaintoon.domain.nft.dto.blockchain.response;

import lombok.*;

/**
 * 클라이언트에 반환할 거래 항목의 응답 DTO입니다.
 * 필요한 필드를 가공(예: 숫자값을 십진수 문자열로 변환)하여 포함합니다.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionItemResponseDto {
    /** 블록 번호 (십진수 문자열) */
    private String blockNumber;

    /** 타임스탬프 (십진수 문자열) */
    private String timeStamp;

    /** 거래 해시값 */
    private String hash;

    /** 넌스 (십진수 문자열) */
    private String nonce;

    /** 블록 해시값 */
    private String blockHash;

    /** 거래 인덱스 */
    private String transactionIndex;

    /** 송신 주소 */
    private String from;

    /** 수신 주소 */
    private String to;

    /** 전송된 값 (필요 시 추가 가공 가능) */
    private String value;

    /** 가스 한도 (십진수 문자열) */
    private String gas;

    /** 가스 가격 (십진수 문자열) */
    private String gasPrice;

    /** 에러 여부 (문자열) */
    private String isError;

    /**
     * 트랜잭션 영수증 상태
     * JSON의 txreceipt_status 필드를 Camel Case로 변환하여 사용합니다.
     */
    private String txreceiptStatus;

    /** 입력 데이터 */
    private String input;

    /** 계약 주소 */
    private String contractAddress;

    /** 누적 가스 사용량 */
    private String cumulativeGasUsed;

    /** 사용된 가스 */
    private String gasUsed;

    /** 확인 횟수 (십진수 문자열) */
    private String confirmations;

    /** 메소드 아이디 */
    private String methodId;

    /** 함수 이름 */
    private String functionName;
}