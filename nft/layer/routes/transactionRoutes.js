// file: src/routes/transactionRoutes.js
import express from 'express';
import { 
  syncNewTransactionsController, 
  getTransactionDetailsController, 
  getTransactionLogsController 
} from '../controllers/transactionController.js';

const router = express.Router();

// 신규 동기화: DB의 마지막 블록 이후부터 최신 블록까지 조회
router.get('/transaction/sync/new', syncNewTransactionsController);

// 개별 트랜잭션 영수증 조회
router.get('/transaction/details/:txHash', getTransactionDetailsController);

// 저장된 트랜잭션 로그 조회 (페이지네이션)
router.get('/transaction/logs', getTransactionLogsController);

export default router;
