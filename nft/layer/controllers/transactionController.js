// file: src/controllers/transactionController.js
import AppError from '../../utils/AppError.js';
import { 
  getTransactionDetails, 
  syncNewTransactions, 
  getContractTransactionLogs 
} from '../services/transactionService.js';
import { CONTRACT_CONFIG } from '../config/config.js';
const NFT_MARKETPLACE_ADDRESS = CONTRACT_CONFIG.NFT_MARKETPLACE_ADDRESS;

/**
 * GET /api/nft/transaction/sync/new
 * DB의 마지막 동기화 블록 이후부터 최신 블록까지 이벤트 로그 동기화
 */
export async function syncNewTransactionsController(req, res, next) {
  try {
    const contractAddress = NFT_MARKETPLACE_ADDRESS;
    const result = await syncNewTransactions(contractAddress);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(new AppError("신규 동기화 실패: " + error.message, error.statusCode || 500));
  }
}

/**
 * GET /api/nft/transaction/details/:txHash
 */
export async function getTransactionDetailsController(req, res, next) {
  try {
    const { txHash } = req.params;
    if (!txHash) {
      throw new AppError("txHash가 필요합니다.", 400);
    }
    const receipt = await getTransactionDetails(txHash);
    res.status(200).json({ status: 'success', data: receipt });
  } catch (error) {
    next(new AppError(`트랜잭션 정보 조회 실패: ${error.message}`, error.statusCode || 500));
  }
}

/**
 * GET /api/nft/transaction/logs?page=1&size=20
 */
export async function getTransactionLogsController(req, res, next) {
  try {
    const { page, size } = req.query;
    const logs = await getContractTransactionLogs({
      page: Number(page) || 1,
      size: Number(size) || 20
    });
    res.status(200).json({ status: 'success', data: logs });
  } catch (error) {
    next(new AppError("로그 조회 실패: " + error.message, error.statusCode || 500));
  }
}

export default {
  syncNewTransactionsController,
  getTransactionDetailsController,
  getTransactionLogsController,
};
