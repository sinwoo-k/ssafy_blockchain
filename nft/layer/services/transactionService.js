// layer/services/transactionService.js
import AppError from '../../utils/AppError.js';
import {
  dbInsertTransactionLog,
  dbGetTransactionLogs,
  dbGetLastSyncedBlock,
  apiFetchWalletTransactions,
  bcFetchWalletNFTs,
  apiGetAllTransactionsForContract,
  bcGetTransactionReceipt,
  bcGetSaleLogs,
  bcGetTransactionSender
} from '../repositories/transactionRepository.js';
import { ethers } from 'ethers';
import { NFT_MARKETPLACE_ABI, NFT_MARKETPLACE_ADDRESS, FIRST_SYNC_BLOCK } from '../config/contract.js';

/**
 * 지갑 거래 내역 조회 서비스
 */
export async function getWalletTransactionsService(walletAddress) {
  try {
    const data = await apiFetchWalletTransactions(walletAddress);
    if (data.status !== "1") {
      // 비즈니스 로직: 거래 내역이 없으면 빈 배열 반환
      return [];
    }
    // NFT 컨트랙트와 관련된 거래만 필터링 (서비스 계층에서 비즈니스 로직 처리)
    const filtered = data.result.filter(tx => {
      return tx.to && tx.to.toLowerCase() === process.env.NFT_MARKETPLACE_ADDRESS.toLowerCase();
    });
    return filtered;
  } catch (error) {
    throw new AppError("서비스: 지갑 거래 내역 조회 실패 - " + error.message, 500);
  }
}

/**
 * 지갑 보유 NFT 목록 조회 서비스
 */
export async function getWalletNFTsService(walletAddress) {
  try {
    // 추가 유효성 검사: walletAddress 형식 검증 등
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      throw new AppError("유효한 지갑 주소가 아닙니다.", 400);
    }
    const tokens = await bcFetchWalletNFTs(walletAddress);
    return tokens;
  } catch (error) {
    throw new AppError("서비스: NFT 목록 조회 실패 - " + error.message, 500);
  }
}

/**
 * 신규 트랜잭션 동기화 서비스
 */
export async function syncNewTransactionsService(contractAddress) {
  try {
    
    const lastSyncedBlock = await dbGetLastSyncedBlock();
    const startBlock = lastSyncedBlock === 0 ? (Number(process.env.FIRST_SYNC_BLOCK) || 0) : lastSyncedBlock + 1;
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const endBlock = await provider.getBlockNumber();
    if (startBlock > endBlock) {
      return { success: true, message: "새로운 트랜잭션이 없습니다." };
    }
    const chunkSize = 1000;
    let totalInserted = 0;
    let currentBlock = startBlock;
    while (currentBlock <= endBlock) {
      const toBlock = Math.min(currentBlock + chunkSize - 1, endBlock);
      
      const apiResponse = await apiGetAllTransactionsForContract(
        contractAddress,
        currentBlock.toString(),
        toBlock.toString()
      );
    
      // ✔️ result 배열 추출 (정상 응답일 때만)
      const transactions = apiResponse.status === "1" ? apiResponse.result : [];
    
      // ✔️ 유효성 검사
      const validTransactions = transactions.filter(tx => tx && tx.from && tx.hash);
    
      for (const txData of validTransactions) {
        await dbInsertTransactionLog(txData, contractAddress);
        totalInserted++;
      }
    
      currentBlock = toBlock + 1;
    }
    return { success: true, message: `${totalInserted}개의 트랜잭션이 저장되었습니다.` };
  } catch (error) {
    throw new AppError("서비스: 신규 트랜잭션 동기화 실패 - " + error.message, 500);
  }
}

/**
 * 특정 트랜잭션 영수증 조회 서비스
 */
export async function getTransactionDetailsService(txHash) {
  try {
    const receipt = await bcGetTransactionReceipt(txHash);
    if (!receipt) {
      throw new AppError("영수증이 존재하지 않습니다.", 404);
    }
    return receipt;
  } catch (error) {
    throw new AppError("서비스: 트랜잭션 정보 조회 실패 - " + error.message, 500);
  }
}

/**
 * 판매 완료 거래 내역 조회 서비스
 */
export async function getSaleTransactionsService(walletAddress) {
  try {
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      throw new AppError("유효한 지갑 주소가 아닙니다.", 400);
    }
    const logs = await bcGetSaleLogs();
    const iface = new ethers.Interface(NFT_MARKETPLACE_ABI);
    const sales = [];
    for (const log of logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed.name === 'NFTSold') {
          const sender = await bcGetTransactionSender(log.transactionHash);
          if (sender && sender.toLowerCase() === walletAddress.toLowerCase()) {
            sales.push({
              transactionHash: log.transactionHash,
              blockNumber: log.blockNumber,
              tokenId: parsed.args.tokenId.toString(),
              buyer: parsed.args.buyer,
              price: parsed.args.price.toString(),
            });
          }
        }
      } catch (err) {
        continue;
      }
    }
    return sales;
  } catch (error) {
    throw new AppError("서비스: 판매 거래 내역 조회 실패 - " + error.message, 500);
  }
}

export default {
  getWalletTransactionsService,
  getWalletNFTsService,
  syncNewTransactionsService,
  getTransactionDetailsService,
  getSaleTransactionsService,
};
