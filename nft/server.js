import 'dotenv/config';
import express from 'express';
import walletRoutes from './wallet/routes/walletRoutes.js';
import nonceRoutes from './nonce/routes/nonceRoutes.js';

const app = express();
app.use(express.json());

// 라우터 연결
app.use('/api', walletRoutes);
app.use('/api', nonceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`));
