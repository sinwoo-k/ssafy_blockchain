import express from 'express';
import { getTransactionDetailsController } from '../controllers/transactionController.js';

const router = express.Router();

router.get('/transaction/:txHash', getTransactionDetailsController);


export default router;