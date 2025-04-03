import { ethers } from 'ethers';
import { encrypt, decrypt } from '../../cryptoHelper.js';
import {
  getWalletByAddress,
  getWalletByUserId,
  createMetamaskWallet,
  createUser,
  createWallet
} from '../repositories/walletRepository.js';
import AppError from '../../utils/AppError.js';
import { getNonce, deleteNonce } from './nonceService.js';
import { setChallenge } from './nftService.js';
import { WALLET_CONTRACT_ABI, WALLET_CONTRACT_ADDRESS, RPC_URL } from '../config/contract.js'
// 이더리움 네트워크 연결 및 관리자 지갑 생성
const provider = new ethers.JsonRpcProvider(RPC_URL);
const serverWallet = new ethers.Wallet(process.env.SERVER_PRIVATE_KEY, provider);


// 스마트 컨트랙트 인스턴스 (관리자 지갑 사용)
const walletManagerContract = new ethers.Contract(WALLET_CONTRACT_ADDRESS, WALLET_CONTRACT_ABI, serverWallet);

/**
 * 메타마스크 지갑 연결 서비스 함수
 */
export async function connectWalletService({ walletAddress, signature, message }) {
  try {
    const storedNonce = await getNonce(walletAddress);
    if (!storedNonce) {
      throw new AppError('해당 지갑 주소에 대한 nonce가 존재하지 않습니다.', 400);
    }
    // 클라이언트에서 전달받은 message가 저장된 nonce와 일치하는지 확인
    if (storedNonce !== message) {
      throw new AppError('전달된 메시지가 유효하지 않습니다.', 400);
    }
    const recoveredAddress = ethers.verifyMessage(message, signature);
    console.log(`Recovered Address: ${recoveredAddress}`);
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new AppError('서명이 유효하지 않습니다.', 401);
    }
    
    await deleteNonce(walletAddress);

    // 임의의 닉네임 생성
    const randomNumber = Math.floor(Math.random() * 1000000);
    const nickname = `Metamask${randomNumber}`;
    const joinDate = new Date().toISOString().split('T')[0];
    console.log(`Join Date: ${joinDate}`);

    const userData = {
      nickname,
      joinDate,
      deleted: "N"
    };
    const userId = await createUser(userData);
    if (!userId) {
      throw new AppError('User not found', 404);
    }
    await createMetamaskWallet(walletAddress, userId);

    return { walletAddress, message: 'Wallet connected successfully.' };
  } catch (error) {
    console.error(`connectWalletService Error: ${error.stack}`);
    if (error instanceof AppError) throw error;
    throw new AppError('지갑 연결 중 오류가 발생했습니다: ' + error.message, 500);
  }
}

/**
 * 새 지갑 생성 서비스 함수
 */
export async function createWalletService({ userId }) {
  try {
    const existingWallet = await getWalletByUserId(userId);
    if (existingWallet) {
      throw new AppError('이미 지갑이 존재합니다.', 400);
    }

    // 새 지갑 생성 (랜덤 지갑 생성)
    const newWallet = ethers.Wallet.createRandom();
    const walletAddress = newWallet.address;
    const privateKey = newWallet.privateKey;
    const publicKey = newWallet.publicKey;
    const recoveryPhrase = newWallet.mnemonic.phrase;

    // 민감 데이터 암호화 (개인키, 복구 구문)
    const encryptedPrivateKey = encrypt(privateKey);
    const encryptedRecoveryPhrase = encrypt(recoveryPhrase);

    // DB에 지갑 정보 저장
    const walletId = await createWallet({
      userId,
      walletAddress,
      privateKey: encryptedPrivateKey,
      publicKey,
      recoveryPhrase: encryptedRecoveryPhrase,
    });

    // 스마트 컨트랙트에 관리자의 adminRegisterWallet 함수 호출하여 새 지갑 등록
    const txRegister = await walletManagerContract.adminRegisterWallet(walletAddress, publicKey);
    await txRegister.wait();

    // 초기 자금 송금(필요 시 주석 해제)
    // const amountToSend = ethers.parseEther("0.05");
    // const txSend = await serverWallet.sendTransaction({ to: walletAddress, value: amountToSend });
    // await txSend.wait();

    return {
      walletId,
      walletAddress,
      publicKey,
      privateKey,
      recoveryPhrase,
      // initialFundingTxHash: txSend.hash
    };
  } catch (error) {
    console.error(`createWalletService Error: ${error.stack}`);
    if (error instanceof AppError) throw error;
    throw new AppError('지갑 생성 중 오류가 발생했습니다: ' + error.message, 500);
  }
}

/**
 * 지갑 정보 조회 서비스 함수
 */
export async function getWalletInfoService({ userId }) {
  try {
    const wallet = await getWalletByUserId(userId);
    if (!wallet) throw new AppError('Wallet not found', 404);
    const walletAddress = wallet.wallet_address;
    
    // 온체인 지갑 정보 조회
    const result = await walletManagerContract.getWalletInfo(walletAddress);

    // ETH 잔고 조회
    const ethBalanceWei = await provider.getBalance(walletAddress);
    const ethBalance = ethers.formatEther(ethBalanceWei);
    
    const formattedEth = parseFloat(ethBalance).toFixed(5);

    if (wallet.private_key) {
      return {
        walletId: wallet.wallet_id,
        walletAddress: wallet.wallet_address,
        publicKey: wallet.public_key,
        private_key: decrypt(wallet.private_key),
        coinType: wallet.coin_type,
        isRegistered: result[0],
        contractPublicKey: result[1],
        balances: {
          eth: `${formattedEth} ETH`
        }
      };
    }
    return {
      walletId: wallet.wallet_id,
      walletAddress: wallet.wallet_address,
      publicKey: wallet.public_key,
      coinType: wallet.coin_type,
      isRegistered: result[0],
      contractPublicKey: result[1],
      balances: {
        eth: `${ethBalance} ETH`
      }
    };
  } catch (error) {
    console.error(`getWalletInfoService Error: ${error.stack}`);
    if (error instanceof AppError) throw error;
    throw new AppError('지갑 정보 조회 중 오류가 발생했습니다: ' + error.message, 500);
  }
}

/**
 * 트랜잭션 전송 서비스 함수
 */
export async function sendTransactionService({ fromAddress, toAddress, amount }) {
  try {
    // fromAddress에 해당하는 지갑 정보 조회
    const wallet = await getWalletByAddress(fromAddress);
    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    // 송금 금액을 Wei로 변환
    const amountToSend = ethers.parseEther(amount.toString());
    console.log("Amount to send (wei):", amountToSend.toString());

    // RPC Provider 생성 (이미 상단에 생성되어 있으므로 재사용 가능)
    // 가스 정보 조회
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    const gasLimit = 21000;
    console.log("Gas Price (Gwei):", ethers.formatUnits(gasPrice, "gwei"));
    console.log("Gas Limit:", gasLimit.toString());

    // 개인키가 있는 경우 (서버가 직접 서명)
    if (wallet.private_key) {
      const decryptedPrivateKey = decrypt(wallet.private_key);
      const userWallet = new ethers.Wallet(decryptedPrivateKey, provider);

      try {
        const tx = await userWallet.sendTransaction({
          to: toAddress,
          value: amountToSend,
          gasPrice: gasPrice,
          gasLimit: gasLimit,
        });
        const receipt = await tx.wait();
        return {
          from: fromAddress,
          to: toAddress,
          amount: `${amount} ETH`,
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
        };
      } catch (txError) {
        console.error("트랜잭션 전송 중 오류:", txError.stack);
        throw new AppError('트랜잭션 전송 중 오류가 발생했습니다.', 500);
      }
    } else {
      // 개인키가 없는 경우: MetaMask를 통한 거래 전송 위임
      console.log("MetaMask 전송을 위한 payload 생성 중...");
      const metamaskPayload = {
        to: toAddress,
        value: amountToSend.toString(),
        gasPrice: gasPrice.toString(),
        gasLimit: gasLimit,
      };
      const messageToSign = `${fromAddress}-${Date.now()}`;
      const challengeData = {
        message: messageToSign,
        operation: 'sendTransaction',
        extra: { fromAddress, toAddress, amount, metamaskPayload }
      };
      await setChallenge(wallet.user_id, challengeData);
      return { needSignature: true, messageToSign };
    }
  } catch (error) {
    console.error(`sendTransactionService Error: ${error.stack}`);
    if (error instanceof AppError) throw error;
    throw new AppError('송금 처리 중 오류가 발생했습니다: ' + error.message, 500);
  }
}



export default {
  createWalletService,
  connectWalletService,
  getWalletInfoService,
  sendTransactionService,
};
