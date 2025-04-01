import express from 'express';
import { createWallet, getWalletInfo, connectWallet,sendTransaction, getWalletNFTsController, getWalletTransactionsController } from '../../layer/controllers/walletController.js';

const router = express.Router();

router.post('/create-wallet/:userId', createWallet);
router.get('/wallet-info/:userId', getWalletInfo);
router.post('/connect-wallet', connectWallet);
router.post('/send-transaction', sendTransaction);
router.get('/wallet/transactions/:address', getWalletTransactionsController);
router.get('/wallet/nfts/:address', getWalletNFTsController);
export default router;
