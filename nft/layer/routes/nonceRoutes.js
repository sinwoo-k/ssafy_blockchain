import express from 'express';
import { getNonce } from '../controllers/nonceController.js';

const router = express.Router();

router.get('/nonce', getNonce);

export default router;
