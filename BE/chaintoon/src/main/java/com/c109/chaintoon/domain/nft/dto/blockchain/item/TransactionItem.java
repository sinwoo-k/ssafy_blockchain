package com.c109.chaintoon.domain.nft.dto.blockchain.item;

import lombok.*;

/**
 * 각 거래 항목의 상세 정보를 담은 DTO입니다.
 * JSON 응답 내 각 거래 항목의 필드들을 매핑합니다.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionItem {
    /** 블록 번호 (문자열 형태) */
    private String blockNumber;

    /** 타임스탬프 (문자열 형태) */
    private String timeStamp;

    /** 거래 해시값 */
    private String hash;

    /** 넌스 값 */
    private String nonce;

    /** 블록 해시값 */
    private String blockHash;

    /** 거래 인덱스 */
    private String transactionIndex;

    /** 송신 주소 */
    private String from;

    /** 수신 주소 */
    private String to;

    /** 전송된 값 */
    private String value;

    /** 가스 한도 */
    private String gas;

    /** 가스 가격 */
    private String gasPrice;

    /** 에러 여부 (0 또는 1) */
    private String isError;

    /** 트랜잭션 영수증 상태 */
    private String txreceipt_status;

    /** 입력 데이터 */
    private String input;

    /** 생성된 계약 주소 (해당되지 않으면 빈 문자열) */
    private String contractAddress;

    /** 누적 사용된 가스 */
    private String cumulativeGasUsed;

    /** 사용된 가스 */
    private String gasUsed;

    /** 확인 횟수 */
    private String confirmations;

    /** 메소드 아이디 */
    private String methodId;

    /** 호출된 함수 이름 */
    private String functionName;
}
