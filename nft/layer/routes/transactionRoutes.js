// layer/routes/transactionRoutes.js
import express from 'express';
import {
  getWalletTransactionsController,
  getWalletNFTsController,
  syncNewTransactionsController,
  getTransactionDetailsController,
  getSaleTransactionsController
} from '../controllers/transactionController.js';

const router = express.Router();

// 지갑 거래 내역 조회
router.get('/transactions/:walletAddress', getWalletTransactionsController);
// 지갑 보유 NFT 목록 조회
router.get('/wallet-nfts/:walletAddress', getWalletNFTsController);
// 판매 완료 거래 내역 조회
router.get('/sales/:walletAddress', getSaleTransactionsController);
// 특정 트랜잭션 영수증 조회
router.get('/transaction/:txHash', getTransactionDetailsController);
// 트랜잭션 동기화 (컨트랙트 주소를 파라미터로)
router.get('/sync', syncNewTransactionsController);

export default router;
