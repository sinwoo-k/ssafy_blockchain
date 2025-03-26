import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import walletRoutes from './layer/routes/walletRoutes.js';
import nftRoutes from './layer/routes/nftRoutes.js';
import nonceRoutes from './layer/routes/nonceRoutes.js';
import { authenticateJWT } from './middleware/auth.js';

const app = express();

app.use(cors({
    origin: ['http://localhost:5173','https://j12c109.p.ssafy.io', 'http://localhost:8080'],
    credentials: true,
  }));

app.use(express.json());

// 라우터 연결
app.use('/api/nft', nonceRoutes);
app.use('/api/nft', walletRoutes);

app.use('/api/nft', authenticateJWT);
app.use('/api/nft', nftRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`));
