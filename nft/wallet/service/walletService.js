import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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

/**
 * MetaMask 지갑 연결 (서명 검증) 처리
 * @param {Object} params - { user_email, wallet_address, signature, message }
 * @returns {Promise<Object>} 연결 결과
 */
export async function connectWalletService({ user_email, wallet_address, signature, message }) {
  // Redis에 저장된 nonce 조회 (클라이언트가 받았던 nonce)
  const expectedNonce = await getNonce(user_email);

  if (!expectedNonce || expectedNonce !== message) {
    throw new AppError('Nonce가 일치하지 않습니다.', 401);
  }

  // 메시지 서명 검증 (서명된 메시지와 제공된 지갑 주소 비교)
  const recoveredAddress = ethers.verifyMessage(message, signature);
  if (recoveredAddress.toLowerCase() !== wallet_address.toLowerCase()) {
    throw new AppError('서명이 유효하지 않습니다.', 401);
  }

  // 검증이 성공하면 사용한 nonce 삭제 (재사용 방지)
  await deleteNonce(user_email);

  return { wallet_address, message: 'Wallet connected successfully.' };
}

/**
 * 새 지갑 생성 및 등록 처리 (비즈니스 로직)
 * @param {Object} params - { user_email, coin_type }
 * @returns {Object} 생성된 지갑 데이터
 */
export async function createWalletService({ user_email }) {
  // 0. 이메일 중복 체크
  const existingWallet = await walletRepository.findWalletByEmail(user_email);
  if (existingWallet) {
    throw new AppError('이미 등록된 이메일입니다.', 400);
  }

  // 1. 새 지갑 생성 (랜덤 지갑 생성)
  const newWallet = ethers.Wallet.createRandom();
  const wallet_address = newWallet.address;
  const private_key = newWallet.privateKey;
  const public_key = newWallet.publicKey;
  const recovery_phrase = newWallet.mnemonic.phrase;

  // 2. 민감 데이터 암호화 (개인키, 복구 구문)
  const encryptedPrivateKey = encrypt(private_key);
  const encryptedRecoveryPhrase = encrypt(recovery_phrase);

  // 3. DB에 지갑 정보 저장 (Data Access Layer 호출)
  const walletId = await walletRepository.createWallet({
    user_id,
    user_email,
    wallet_address,
    private_key: encryptedPrivateKey,
    public_key,
    recovery_phrase: encryptedRecoveryPhrase,
  });

  // 4. 스마트 컨트랙트에 관리자의 adminRegisterWallet 함수 호출하여 새 지갑 등록
  const txRegister = await walletManagerContract.adminRegisterWallet(wallet_address, public_key);
  await txRegister.wait();
  // 5. 관리자가 새 지갑으로 송금 (0.05 ETH)
  // const amountToSend = ethers.parseEther("0.05"); // ETH -> Wei 변환
  // const txSend = await serverWallet.sendTransaction({
  //   to: wallet_address,
  //   value: amountToSend
  // });
  // await txSend.wait();

  return {
    wallet_id: walletId,
    wallet_address,
    public_key,
    private_key,
    recovery_phrase,
    // initialFundingTxHash: txSend.hash // 초기 송금 트랜잭션 해시 반환
  };
}

export async function getWalletInfoService({ wallet_address, user_email }) {
  // 온체인 지갑 정보 조회
  const result = await walletManagerContract.getWalletInfo(wallet_address);

  // DB에서 지갑 정보 조회
  const wallet = await walletRepository.findWalletByEmail(user_email);
  if (!wallet) throw new Error('Wallet not found');

  // 개인키 및 복구 구문 복호화
  const decryptedPrivateKey = decrypt(wallet.private_key);
  const decryptedRecoveryPhrase = decrypt(wallet.recovery_phrase);

  // ETH 잔고 조회
  const ethBalanceWei = await provider.getBalance(wallet_address);
  const ethBalance = ethers.formatEther(ethBalanceWei); // Wei를 ETH로 변환

  return {
    wallet_id: wallet.wallet_id,
    wallet_address: wallet.wallet_address,
    public_key: wallet.public_key,
    private_key: decryptedPrivateKey,
    recovery_phrase: decryptedRecoveryPhrase,
    coin_type: wallet.coin_type,
    isRegistered: result[0],
    publicKey: result[1],
    balances: {
      eth: `${ethBalance} ETH`
    }
  };
}

export async function sendTransactionService({ from_address, to_address, amount, user_email }) {
  // DB에서 사용자 지갑 정보 조회
  const wallet = await walletRepository.findWalletByEmail(user_email);
  if (!wallet) throw new AppError('지갑 정보를 찾을 수 없습니다.', 404);

  // 개인키 복호화 후 Wallet 객체 생성
  const decryptedPrivateKey = decrypt(wallet.private_key);
  const userWallet = new ethers.Wallet(decryptedPrivateKey, provider);

  // 송금 금액을 Wei로 변환
  const amountToSend = ethers.parseEther(amount.toString()); // Ethers v6 구문

  try {
    // 트랜잭션 생성 및 전송
    const tx = await userWallet.sendTransaction({
      to: to_address,
      value: amountToSend,
    });

    // 트랜잭션 확인 대기
    const receipt = await tx.wait();

    return {
      from: from_address,
      to: to_address,
      amount: `${amount} ETH`,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error("트랜잭션 전송 중 오류:", error);
    throw new AppError('트랜잭션 전송 중 오류가 발생했습니다.', 500);
  }
}



export default {
  createWalletService,
  connectWalletService,
  getWalletInfoService,
  sendTransactionService,
};