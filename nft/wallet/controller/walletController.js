import { createWalletService, getWalletInfoService } from '../service/walletService.js';

export async function createWallet(req, res) {
  try {
    const { user_email, coin_type } = req.body;
    if (!user_email) {
      return res.status(400).json({ error: 'email은 필수입니다.' });
    }
    const walletData = await createWalletService({ user_email, coin_type });
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
    const { wallet_address, user_email } = req.body;
    if (!wallet_address) {
      return res.status(400).json({ error: 'wallet_address가 필요합니다.' });
    }
    const info = await getWalletInfoService({ wallet_address, user_email });
    res.status(200).json(info);
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || '지갑 조회 중 오류가 발생했습니다.' });
  }
}

export async function connectWallet(req, res) {
  try {
    const { user_email, wallet_address, signature, message } = req.body;
    if (!user_email || !wallet_address || !signature || !message) {
      return res.status(400).json({ error: 'user_email, wallet_address, signature, 그리고 message가 필요합니다.' });
    }
    const result = await connectWalletService({ user_email, wallet_address, signature, message });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || '지갑 연결 중 오류가 발생했습니다.' });
  }
}
