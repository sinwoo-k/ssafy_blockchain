// wallet/controllers/walletController.js
const walletService = require('../service/walletService');

async function createWallet(req, res) {
  try {
    const { user_email, coin_type } = req.body;
    if (!user_email) {
      return res.status(400).json({ error: 'email은 필수입니다.' });
    }
    const walletData = await walletService.createWalletService({ user_email, coin_type });
    res.status(201).json({
      ...walletData,
      message: '제공된 이메일에 대해 새 지갑이 생성되고, 컨트랙트에 등록되었습니다.'
    });
  } catch (err) {
    console.error(err);
    // 만약 서비스에서 statusCode를 지정했다면 그대로 사용
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || '지갑 생성 중 오류가 발생했습니다.' });
  }
}

async function getWalletInfo(req, res) {
  try {
    const { wallet_address } = req.params;
    if (!wallet_address) {
      return res.status(400).json({ error: 'wallet_address가 필요합니다.' });
    }
    const info = await walletService.getWalletInfoService({ wallet_address });
    res.status(200).json(info);
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || '지갑 조회 중 오류가 발생했습니다.' });
  }
}

module.exports = { createWallet, getWalletInfo };
