import express from "express";
import multer from 'multer';
import {
    createWalletController,
    registerNftController,
    transferController,
    listNftController,
    getBalanceController,
    buyNftController,
    getParsedTransactionLogsController,
    getNftTransfersController
} from "../controllers/supperAppController.js";
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// 지갑 생성
router.post('/wallet/create', createWalletController);

// NFT 등록
router.post('/nft/register', upload.single('file'), registerNftController);

// 이더 송금
router.post('/transfer', transferController);

// NFT 판매 등록
router.post('/nft/list', listNftController);

// 지갑 잔액 조회
router.get('/wallet/:address/balance', getBalanceController);

// NFT 구매
router.post('/nft/buy', buyNftController);

// 트랜잭션 로그 파싱
router.get('/transaction-logs/:txHash', getParsedTransactionLogsController);

// 지갑 NFT Transfer 이력
router.get('/nft-transfers/:walletAddress', getNftTransfersController);

export default router;