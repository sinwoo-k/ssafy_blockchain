import express from 'express';
import { createWallet, getWalletInfo, connectWallet,sendTransaction } from '../../layer/controllers/walletController.js';

const router = express.Router();

router.post('/create-wallet', createWallet);
router.get('/wallet-info', getWalletInfo);
router.post('/connect-wallet', connectWallet);
router.post('/send-transaction', sendTransaction);

export default router;
