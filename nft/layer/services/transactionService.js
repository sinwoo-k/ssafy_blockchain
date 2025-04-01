import { ethers } from 'ethers';
import axios from 'axios';
import AppError from '../../utils/AppError.js';
import { insertTransactionLog, getTransactionLogs, getLastSyncedBlock } from '../repositories/transactionRepository.js';

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const ETHERSCAN_BASE_URL = "https://api-holesky.etherscan.io/api";

// Holesky EtherScan API에서 txlist 조회
export async function getAllTransactionsForContract(contractAddress, fromBlock = "0", toBlock = "latest") {
  try {
    const apiKey = process.env.ETHERSCAN_API_KEY;
    if (!apiKey) {
      throw new AppError("Etherscan API 키가 제공되지 않았습니다.", 500);
    }
    let toBlockParam = toBlock;
    if (toBlock === "latest") {
      const latestBlock = await provider.getBlockNumber();
      toBlockParam = latestBlock.toString();
    }
    const url = `${ETHERSCAN_BASE_URL}?module=account&action=txlist&address=${contractAddress}&startblock=${fromBlock}&endblock=${toBlockParam}&sort=asc&apikey=${apiKey}`;
    console.log("Etherscan API 호출 URL:", url);

    const response = await axios.get(url);
    console.log("Etherscan API 응답:", response.data);

    if (response.data.status !== "1") {
      console.log("Etherscan 트랜잭션 조회 결과:", response.data.message);
      return [];
    }
    return response.data.result;
  } catch (error) {
    throw new AppError("트랜잭션 조회 실패: " + error.message, 500);
  }
}

// 새로운 트랜잭션 동기화
export async function syncNewTransactions(contractAddress) {
  try {
    let lastSyncedBlock = await getLastSyncedBlock();
    if (lastSyncedBlock === 0) {
      lastSyncedBlock = Number(process.env.FIRST_SYNC_BLOCK) || 0;
      console.log(`DB에 기록된 트랜잭션이 없으므로, FIRST_SYNC_BLOCK(${lastSyncedBlock})부터 동기화를 시작합니다.`);
    } else {
      console.log(`DB에 기록된 마지막 블록: ${lastSyncedBlock}`);
    }
    const latestBlock = await provider.getBlockNumber();
    console.log(`현재 최신 블록 번호: ${latestBlock}`);

    if (lastSyncedBlock >= latestBlock) {
      return { success: true, message: "새로운 트랜잭션이 없습니다." };
    }

    let startBlock = lastSyncedBlock + 1;
    const endBlock = latestBlock;
    const chunkSize = 1000;
    let totalInserted = 0;

    while (startBlock <= endBlock) {
      const toBlock = Math.min(startBlock + chunkSize - 1, endBlock);
      console.log(`동기화: 블록 ${startBlock} ~ ${toBlock}`);
      try {
        // 각 청크에 대해 txlist 조회
        const transactions = await getAllTransactionsForContract(contractAddress, startBlock.toString(), toBlock.toString());
        // 값이 존재하고 필수 필드(from, hash)가 있는 트랜잭션만 필터링
        const validTransactions = transactions.filter(tx => tx && tx.from && tx.hash);
        for (const txData of validTransactions) {
          // 필요 시 timeStamp를 변환해서 로그에 남길 수 있음
          // 예: txData.timestamp = new Date(Number(txData.timeStamp) * 1000 + 9 * 3600 * 1000);
          await insertTransactionLog(txData, contractAddress);
          totalInserted++;
        }
      } catch (chunkError) {
        console.error(`청크 처리 중 오류 (블록 ${startBlock} ~ ${toBlock}):`, chunkError);
      }
      startBlock = toBlock + 1;
    }
    return { success: true, message: `${totalInserted}개의 트랜잭션이 저장되었습니다.` };
  } catch (error) {
    throw new AppError("신규 트랜잭션 동기화 실패: " + error.message, 500);
  }
}

// 트랜잭션 로그 조회 (페이지네이션)
export async function getContractTransactionLogs({ page, size }) {
  try {
    const logs = await getTransactionLogs({ page, size });
    return logs;
  } catch (error) {
    throw new AppError("트랜잭션 로그 조회 실패: " + error.message, 500);
  }
}

// 특정 트랜잭션의 영수증 조회
export async function getTransactionDetails(txHash) {
  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      throw new AppError("트랜잭션 영수증을 찾을 수 없습니다.", 404);
    }
    return receipt;
  } catch (error) {
    throw new AppError("트랜잭션 정보 조회 실패: " + error.message, 500);
  }
}

export default {
  getAllTransactionsForContract,
  syncNewTransactions,
  getContractTransactionLogs,
  getTransactionDetails,
};
