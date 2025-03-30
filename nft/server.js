import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import walletRoutes from './layer/routes/walletRoutes.js';
import nftRoutes from './layer/routes/nftRoutes.js';
import nonceRoutes from './layer/routes/nonceRoutes.js';
import transactionRoutes from './layer/routes/transactionRoutes.js';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import './scheduler/syncScheduler.js';

app.use(cors({
    origin: ['https://j12c109.p.ssafy.io', 'http://localhost:8080'],
    credentials: true,
  }));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 연결
app.use('/api/nft', nonceRoutes);
app.use('/api/nft', walletRoutes);
app.use('/api/nft', transactionRoutes);
app.use('/api/nft', nftRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`));
