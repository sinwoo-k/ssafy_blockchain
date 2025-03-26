import 'dotenv/config';
import express from 'express';
import walletRoutes from './layer/routes/walletRoutes.js';
import nftRoutes from './layer/routes/nftRoutes.js';
import { authenticateJWT } from './middleware/auth.js';

const app = express();
app.use(express.json());
app.use('/api/nft', authenticateJWT);

// 라우터 연결
app.use('/api/nft', walletRoutes);
app.use('/api/nft', nftRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`));
