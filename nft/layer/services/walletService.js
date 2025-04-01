import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { encrypt, decrypt } from '../../cryptoHelper.js';
import {
  fetchWalletNFTs,
  fetchWalletTransactions,
  getWalletByAddress,
  getWalletByUserId,
  createMetamaskWallet,
  createUser,
  createWallet
} from '../repositories/walletRepository.js';
import AppError from '../../utils/AppError.js';
import { getNonce, deleteNonce } from './nonceService.js';
import { setChallenge } from './nftService.js';
import { get } from 'http';

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

  const storedNonce = await getNonce(walletAddress);
  if (!storedNonce) {
    throw new AppError('해당 지갑 주소에 대한 nonce가 존재하지 않습니다.', 400);
  }
  // 클라이언트에서 전달받은 message가 저장된 nonce와 일치하는지 확인
  if (storedNonce !== message) {
    throw new AppError('전달된 메시지가 유효하지 않습니다.', 400);
  }
  const recoveredAddress = ethers.verifyMessage(message, signature);
  console.log(recoveredAddress);
  if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    throw new AppError('서명이 유효하지 않습니다.', 401);
  }
  
  await deleteNonce(walletAddress);

  const randomNumber = Math.floor(Math.random() * 1000000);
  const nickname = `Metamask${randomNumber}`;
  const joinDate = new Date().toISOString().split('T')[0];
  console.log(joinDate)
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
}

export async function createWalletService({ userId }) {

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

  // DB에 지갑 정보 저장 (Data Access Layer 호출)
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
  // 관리자가 새 지갑으로 송금 (0.05 ETH)
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

export async function getWalletInfoService({ userId }) {

  // DB에서 지갑 정보 조회
  const wallet = await getWalletByUserId(userId);
  if (!wallet) throw new Error('Wallet not found');
  const walletAddress = wallet.wallet_address;
  // 온체인 지갑 정보 조회
  const result = await walletManagerContract.getWalletInfo(walletAddress);

  // ETH 잔고 조회
  const ethBalanceWei = await provider.getBalance(walletAddress);
  const ethBalance = ethers.formatEther(ethBalanceWei); // Wei를 ETH로 변환
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
        eth: `${ethBalance} ETH`
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
}

export async function sendTransactionService({ fromAddress, toAddress, amount }) {
  // fromAddress에 해당하는 지갑 정보 조회
  const wallet = await getWalletByAddress(fromAddress);
  if (!wallet) {
    throw new Error('Wallet not found');
  }

  // 송금 금액을 Wei로 변환 (Ethers v6 구문)
  const amountToSend = ethers.parseEther(amount.toString());
  console.log("Amount to send (wei):", amountToSend.toString());

  // RPC Provider 생성
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  // 트랜잭션 실행 전, 가스 가격 및 가스 한도 정보 조회
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice; // BigInt (wei 단위)
  const gasLimit = 21000; // 기본 ETH 송금의 가스 한도
  console.log("Gas Price (Gwei):", ethers.formatUnits(gasPrice, "gwei"));
  console.log("Gas Limit:", gasLimit.toString());
  console.log(wallet.user_id);
  // 개인키가 있는 경우 (서버가 직접 서명)
  if (wallet.private_key) {
    // 개인키 복호화 후 Wallet 객체 생성
    const decryptedPrivateKey = decrypt(wallet.private_key);
    const userWallet = new ethers.Wallet(decryptedPrivateKey, provider);

    try {
      // 트랜잭션 생성 및 전송 (가스 정보 포함)
      const tx = await userWallet.sendTransaction({
        to: toAddress,
        value: amountToSend,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
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
    // 개인키가 없는 경우: MetaMask를 통한 거래 전송 위임
    // MetaMask에서 사용자가 직접 거래를 전송할 수 있도록 payload를 생성합니다.
    console.log("MetaMask 전송을 위한 payload 생성 중...");
    const metamaskPayload = {
      to: toAddress,
      value: amountToSend.toString(), // 문자열 형태로 변환
      gasPrice: gasPrice.toString(),
      gasLimit: gasLimit,
    };
    // 서명을 위한 메시지 생성 (예: fromAddress와 현재 시간을 포함)
    const messageToSign = `${fromAddress}-${Date.now()}`;
    // 챌린지 데이터 생성하여 Redis에 저장 (키는 fromAddress 사용)
    const challengeData = {
      message: messageToSign,
      operation: 'sendTransaction',
      extra: { fromAddress, toAddress, amount: amount, metamaskPayload }
    };
    await setChallenge(wallet.user_id, challengeData);
    // 클라이언트는 반환받은 messageToSign에 대해 MetaMask로 서명하고,
    // confirmSignature API를 호출하여 최종 거래 전송 payload를 받아 MetaMask로 거래를 진행해야 합니다.
    return { needSignature: true, messageToSign };
  }
}
/**
 * 지갑 주소에 따른 거래 내역을 조회하는 서비스 함수
 */
export async function getWalletTransactions(walletAddress) {
  try {
    const transactions = await fetchWalletTransactions(walletAddress);
    return transactions;
  } catch (error) {
    throw new AppError("서비스: 지갑 거래 내역 조회 실패 - " + error.message, 500);
  }
}

/**
 * 지갑 주소가 보유한 NFT 목록을 조회하는 서비스 함수
 */
export async function getWalletNFTs(walletAddress) {
  try {
    const nfts = await fetchWalletNFTs(walletAddress);
    return nfts;
  } catch (error) {
    throw new AppError("서비스: NFT 목록 조회 실패 - " + error.message, 500);
  }
}


export default {
  createWalletService,
  connectWalletService,
  getWalletInfoService,
  sendTransactionService,
  getWalletTransactions,
  getWalletNFTs
};
