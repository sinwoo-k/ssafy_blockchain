import { generateAndStoreNonce } from '../services/nonceService.js';

export async function getNonce(req, res) {
  try {
    const { walletAddress } = req.query;
    if (!walletAddress) {
      return res.status(400).json({ error: '지갑 주소가 필요합니다.' });
    }
    const nonce = await generateAndStoreNonce(walletAddress);
    res.status(200).json({ nonce });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '논스 생성 중 오류가 발생했습니다.' });
  }
}
