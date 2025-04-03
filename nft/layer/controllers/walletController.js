import { createWalletService, getWalletInfoService, connectWalletService, sendTransactionService } from '../services/walletService.js';
import AppError from '../../utils/AppError.js';

export async function createWallet(req, res) {
  try {
    const { userId } = req.params;
    const walletData = await createWalletService({ userId });
    res.status(201).json({
      ...walletData,
      message: '제공된 이메일에 대해 새 지갑이 생성되고, 컨트랙트에 등록되었습니다.'
    });
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || '지갑 생성 중 오류가 발생했습니다.' });
  }
}

export async function getWalletInfo(req, res) {
  try {
    const { userId } = req.params;
    const info = await getWalletInfoService({ userId });
    res.status(200).json(info);
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || '지갑 조회 중 오류가 발생했습니다.' });
  }
}

export async function connectWallet(req, res) {
  try {
    const { walletAddress, signature, message } = req.body;
    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ error: 'walletAddress, signature, 그리고 message가 필요합니다.' });
    }
    const result = await connectWalletService({ walletAddress, signature, message });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || '지갑 연결 중 오류가 발생했습니다.' });
  }
}

export async function sendTransaction(req, res) {
  try {
    const { fromAddress, toAddress, amount } = req.body;
    if (!fromAddress || !toAddress || !amount) {
      return res.status(400).json({ error: 'fromAddress, toAddress, amount, email는 필수입니다.' });
    }
    const result = await sendTransactionService({ fromAddress, toAddress, amount });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || '트랜잭션 전송 중 오류가 발생했습니다.' });
  }
}
