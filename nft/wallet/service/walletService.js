import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { encrypt, decrypt } from '../../cryptoHelper.js';
import * as walletRepository from '../repository/walletRepository.js';
import AppError from '../../utils/AppError.js';
import { getNonce, deleteNonce } from '../../nonce/service/nonceService.js';

// __dirname 대체 (ES Module 환경)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 이더리움 네트워크 연결 및 관리자 지갑 생성
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const serverWallet = new ethers.Wallet(process.env.SERVER_PRIVATE_KEY, provider);

// 외부 파일에서 컨트랙트 ABI 불러오기 (dist/contracts/WalletManager.json)
const artifactPath = path.join(__dirname, '..', '..', 'dist', 'contracts', 'WalletManager.json');
const walletManagerArtifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const CONTRACT_ABI = walletManagerArtifact.abi;
const WALLET_CONTRACT_ADDRESS = process.env.WALLET_CONTRACT_ADDRESS;

// 스마트 컨트랙트 인스턴스 (관리자 지갑 사용)
const walletManagerContract = new ethers.Contract(WALLET_CONTRACT_ADDRESS, CONTRACT_ABI, serverWallet);


export async function connectWalletService({ walletAddress, signature, message }) {

  // 메시지 서명 검증 (서명된 메시지와 제공된 지갑 주소 비교)
  const recoveredAddress = ethers.verifyMessage(message, signature);
  console.log(recoveredAddress);
  if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    throw new AppError('서명이 유효하지 않습니다.', 401);
  }
  const randomNumber = Math.floor(Math.random() * 1000000);
  const nickname = `Metamask${randomNumber}`;
  const joinDate = new Date().toISOString().split('T')[0];
  console.log(joinDate)
  const userData = {
    nickname,
    joinDate,
    deleted: "N"
  };
  const userId = await walletRepository.createUser(userData);
  if (!userId) {
    throw new AppError('User not found', 404);
  }
  const createMetamaskWallet = await walletRepository.createMetamaskWallet(walletAddress, userId);

  return { walletAddress, message: 'Wallet connected successfully.' };
}

export async function createWalletService({ token }) {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new AppError('유효하지 않은 토큰입니다.', 401);
  }
  const userId = decoded.sub;
  if (!userId) {
    throw new AppError('토큰에 사용자 정보가 포함되어 있지 않습니다.', 401);
  }

  // 1. 새 지갑 생성 (랜덤 지갑 생성)
  const newWallet = ethers.Wallet.createRandom();
  const walletAddress = newWallet.address;
  const privateKey = newWallet.privateKey;
  const publicKey = newWallet.publicKey;
  const recoveryPhrase = newWallet.mnemonic.phrase;

  // 2. 민감 데이터 암호화 (개인키, 복구 구문)
  const encryptedPrivateKey = encrypt(privateKey);
  const encryptedRecoveryPhrase = encrypt(recoveryPhrase);

  // 3. DB에 지갑 정보 저장 (Data Access Layer 호출)
  const walletId = await walletRepository.createWallet({
    userId,
    walletAddress,
    privateKey: encryptedPrivateKey,
    publicKey,
    recoveryPhrase: encryptedRecoveryPhrase,
  });

  // 4. 스마트 컨트랙트에 관리자의 adminRegisterWallet 함수 호출하여 새 지갑 등록
  const txRegister = await walletManagerContract.adminRegisterWallet(walletAddress, publicKey);
  await txRegister.wait();
  // 5. 관리자가 새 지갑으로 송금 (0.05 ETH)
  // const amountToSend = ethers.parseEther("0.05"); // ETH -> Wei 변환
  // const txSend = await serverWallet.sendTransaction({
  //   to: walletAddress,
  //   value: amountToSend
  // });
  // await txSend.wait();

  return {
    walletId,
    walletAddress,
    publicKey,
    privateKey,
    recoveryPhrase,
    // initialFundingTxHash: txSend.hash // 초기 송금 트랜잭션 해시 반환
  };
}

export async function getWalletInfoService({ token }) {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new AppError('유효하지 않은 토큰입니다.', 401);
  }
  const userId = decoded.sub;

  // DB에서 지갑 정보 조회
  const wallet = await walletRepository.findWalletByUserId(userId);
  if (!wallet) throw new Error('Wallet not found');
  const walletAddress = wallet.wallet_address;
  // 온체인 지갑 정보 조회
  const result = await walletManagerContract.getWalletInfo(walletAddress);

  // 개인키 및 복구 구문 복호화
  const decryptedPrivateKey = decrypt(wallet.private_key);
  const decryptedRecoveryPhrase = decrypt(wallet.recovery_phrase);

  // ETH 잔고 조회
  const ethBalanceWei = await provider.getBalance(walletAddress);
  const ethBalance = ethers.formatEther(ethBalanceWei); // Wei를 ETH로 변환

  return {
    walletId: wallet.wallet_id,
    walletAddress: wallet.wallet_address,
    publicKey: wallet.public_key,
    privateKey: decryptedPrivateKey,
    recoveryPhrase: decryptedRecoveryPhrase,
    coinType: wallet.coin_type,
    isRegistered: result[0],
    contractPublicKey: result[1],
    balances: {
      eth: `${ethBalance} ETH`
    }
  };
}

export async function sendTransactionService({ fromAddress, toAddress, amount }) {
  const wallet = await walletRepository.findWalletByAddress(fromAddress);
  if (!wallet) {
    throw new Error('Wallet not found');
  }

  // 송금 금액을 Wei로 변환 (Ethers v6 구문)
  const amountToSend = ethers.parseEther(amount.toString());

  // 서버에 개인키가 저장되어 있는 경우
  if (wallet.private_key) {
    // 개인키 복호화 후 Wallet 객체 생성
    const decryptedPrivateKey = decrypt(wallet.private_key);
    const userWallet = new ethers.Wallet(decryptedPrivateKey, provider);

    try {
      // 트랜잭션 생성 및 전송
      const tx = await userWallet.sendTransaction({
        to: toAddress,
        value: amountToSend,
      });
      // 트랜잭션 확인 대기
      const receipt = await tx.wait();

      return {
        from: fromAddress,
        to: toAddress,
        amount: `${amount} ETH`,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error("트랜잭션 전송 중 오류:", error);
      throw new AppError('트랜잭션 전송 중 오류가 발생했습니다.', 500);
    }
  } else {
    // Metamask 연동된 계정의 경우: 서버에는 개인키가 없으므로 클라이언트에서 서명하도록 트랜잭션 정보를 반환

    // 필요한 트랜잭션 정보 구성
    const nonce = await provider.getTransactionCount(fromAddress);
    const gasPrice = await provider.getGasPrice();
    const gasLimit = 21000; // 기본 ETH 송금의 가스 한도

    // 클라이언트에서 Metamask로 서명 요청할 때 사용될 트랜잭션 객체 구성
    const transactionPayload = {
      from: fromAddress,
      to: toAddress,
      value: amountToSend.toString(), // 일반적으로 wei 단위의 문자열
      nonce,
      gasPrice: gasPrice.toHexString(),
      gasLimit: '0x5208'  // 21000의 16진수 표현 (0x5208)
    };

    return {
      metamask_required: true,
      message: '개인키가 없으므로, Metamask를 통해 트랜잭션 서명이 필요합니다.',
      transactionPayload
    };
  }
}


export default {
  createWalletService,
  connectWalletService,
  getWalletInfoService,
  sendTransactionService,
};
