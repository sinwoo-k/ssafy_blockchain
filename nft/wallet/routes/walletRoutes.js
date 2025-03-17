// routes/walletRoutes.js
const express = require('express');
const router = express.Router();
const walletController = require('../controller/walletController');

router.post('/create-wallet', walletController.createWallet);
router.get('/wallet-info/:wallet_address', walletController.getWalletInfo);

module.exports = router;
