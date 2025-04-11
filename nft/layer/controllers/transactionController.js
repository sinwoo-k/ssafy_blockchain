// layer/controllers/transactionController.js
import AppError from '../../utils/AppError.js';
import {
  getWalletTransactionsService,
  getWalletNFTsService,
  syncNewTransactionsService,
  getTransactionDetailsService,
  getSaleTransactionsService,
  getNftTransfersService,
} from '../services/transactionService.js';
import { NFT_MARKETPLACE_ADDRESS } from '../config/contract.js';

export async function getWalletTransactionsController(req, res, next) {
  try {
    const { walletAddress } = req.params;
    const data = await getWalletTransactionsService(walletAddress);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(new AppError("지갑 거래 내역 조회 실패: " + error.message, error.statusCode || 500));
  }
}

export async function getWalletNFTsController(req, res, next) {
  try {
    const { walletAddress } = req.params;
    const data = await getWalletNFTsService(walletAddress);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(new AppError("NFT 목록 조회 실패: " + error.message, error.statusCode || 500));
  }
}

export async function syncNewTransactionsController(req, res, next) {
  try {
    const result = await syncNewTransactionsService(NFT_MARKETPLACE_ADDRESS);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(new AppError("신규 트랜잭션 동기화 실패: " + error.message, error.statusCode || 500));
  }
}

export async function getTransactionDetailsController(req, res, next) {
  try {
    const { txHash } = req.params;
    const receipt = await getTransactionDetailsService(txHash);
    res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    next(new AppError("트랜잭션 정보 조회 실패: " + error.message, error.statusCode || 500));
  }
}

export async function getSaleTransactionsController(req, res, next) {
  try {
    const { walletAddress } = req.params;
    const data = await getSaleTransactionsService(walletAddress);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(new AppError("판매 거래 내역 조회 실패: " + error.message, error.statusCode || 500));
  }
}

export async function getNftTransfersController(req, res, next) {
  try {
    const { walletAddress } = req.params;
    const data = await getNftTransfersService(walletAddress);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(new AppError(error.message, error.statusCode || 500));
  }
}