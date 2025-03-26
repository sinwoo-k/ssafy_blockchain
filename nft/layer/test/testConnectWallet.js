import { ethers } from "ethers";
import { generateAndStoreNonce } from "../services/nonceService.js";
import { connectWalletService } from "../services/walletService.js";

// 테스트용 스크립트
async function testConnectWallet() {
  try {
    
    // 1. Redis에 nonce 생성 및 저장    // 테스트에서는 메시지를 nonce 그대로 사용 (클라이언트에서는 "Nonce: <nonce>" 같은 형식도 가능하지만, 서비스에서는 일치해야 함)
    
    // 2. 테스트용 지갑 생성 (MetaMask 대신 사용할 테스트 지갑)
    const testPrivateKey = "0x9aa529fe67bc5d9ce7595e4077499a2d1b0e3715b4dff6ce2e2fb2178d2268d4";
    const testWallet = new ethers.Wallet(testPrivateKey);
    const walletAddress = testWallet.address;
    const nonce = await generateAndStoreNonce(testWallet.address);
    const message = nonce;

    // 3. 메시지 서명: 테스트 지갑으로 nonce 메시지를 서명
    const signature = await testWallet.signMessage(message);
    
    console.log("Test Wallet Address:", walletAddress);
    console.log("Generated Nonce (Message):", message);
    console.log("Signature:", signature);
    
    // 4. 서버의 connectWalletService 호출하여 서명 검증 수행
    const result = await connectWalletService({
      walletAddress,
      signature,
      message
    });
    
    console.log("Connect Wallet Service Result:", result);
  } catch (err) {
    console.error("Error in connectWalletService:", err);
  }
}

testConnectWallet();
