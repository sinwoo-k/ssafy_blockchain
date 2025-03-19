import express from 'express';
import { createWallet, getWalletInfo, connectWallet } from '../controller/walletController.js';

const router = express.Router();

router.post('/create-wallet', createWallet);
router.get('/wallet-info', getWalletInfo);
router.post('/connect-wallet', connectWallet);

export default router;
