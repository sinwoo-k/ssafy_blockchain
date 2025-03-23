import { ethers } from "ethers";
import { generateAndStoreNonce } from "../../nonce/service/nonceService.js";
import { connectWalletService } from "../service/walletService.js";

// 테스트용 스크립트
async function testConnectWallet() {
  try {
    const user_email = "wdse123@naver.com";
    
    // 1. Redis에 nonce 생성 및 저장
    const nonce = await generateAndStoreNonce(user_email);
    // 테스트에서는 메시지를 nonce 그대로 사용 (클라이언트에서는 "Nonce: <nonce>" 같은 형식도 가능하지만, 서비스에서는 일치해야 함)
    const message = nonce;
    
    // 2. 테스트용 지갑 생성 (MetaMask 대신 사용할 테스트 지갑)
    const testPrivateKey = "0x67c56a10157af5e5c6f50b13f2eb8d7804c88a53f113c28976886a49ef539a8a";
    const testWallet = new ethers.Wallet(testPrivateKey);
    const wallet_address = testWallet.address;
    
    // 3. 메시지 서명: 테스트 지갑으로 nonce 메시지를 서명
    const signature = await testWallet.signMessage(message);
    
    console.log("Test Wallet Address:", wallet_address);
    console.log("Generated Nonce (Message):", message);
    console.log("Signature:", signature);
    
    // 4. 서버의 connectWalletService 호출하여 서명 검증 수행
    const result = await connectWalletService({
      user_email,
      wallet_address,
      signature,
      message
    });
    
    console.log("Connect Wallet Service Result:", result);
  } catch (err) {
    console.error("Error in connectWalletService:", err);
  }
}

testConnectWallet();
