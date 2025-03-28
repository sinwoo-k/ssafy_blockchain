package com.c109.chaintoon.domain.nft.service;

import com.c109.chaintoon.domain.nft.dto.blockchain.WalletBalance;
import com.c109.chaintoon.domain.nft.dto.blockchain.WalletInfo;
import com.c109.chaintoon.domain.nft.exception.WalletBalanceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class BlockchainService {

    private final RestTemplate resTemplate = new RestTemplate();

    // TODO : 지갑 잔액 조회
    public WalletBalance getWalletBalance(Integer userId) {
        // 호출할 API URL
        String url = "https://j12c109.p.ssafy.io/api/nft/wallet-info/" + userId;

        // URL에 GET 요청 보냄
        WalletInfo walletInfo = resTemplate.getForObject(url,WalletInfo.class);

        // walletInfo 객체가 null이거나, 객체의 balances 필드가 null이거나, eth키가 존재 하지 않으면 에러
        if (walletInfo == null || walletInfo.getBalances() == null || !walletInfo.getBalances().containsKey("eth")){
            throw new WalletBalanceNotFoundException("해당 userId(" + userId + ")의 지갑 잔액 정보를 가져올 수 없습니다.");
        }

        // walletInfo의 balances 맵에서 "eth" 키에 해당하는 값 가져오기
        String ethBalanceStr = walletInfo.getBalances().get("eth");

        double balance = Double.parseDouble(ethBalanceStr.replace("ETH", "").trim());

        return new WalletBalance(balance);
    }

}
