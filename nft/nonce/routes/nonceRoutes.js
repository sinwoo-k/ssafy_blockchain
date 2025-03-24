import express from 'express';
import { getNonce } from '../controller/nonceController.js';

const router = express.Router();

router.get('/nonce', getNonce);

export default router;
