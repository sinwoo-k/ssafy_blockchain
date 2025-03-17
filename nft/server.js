// server.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// 라우터 연결
const walletRoutes = require('./wallet/routes/walletRoutes');
app.use('/api', walletRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`));
