import { generateAndStoreNonce } from '../service/nonceService.js';

export async function getNonce(req, res) {
  try {
    const { user_email } = req.query;
    if (!user_email) {
      return res.status(400).json({ error: 'user_email이 필요합니다.' });
    }
    const nonce = await generateAndStoreNonce(user_email);
    res.status(200).json({ nonce });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '논스 생성 중 오류가 발생했습니다.' });
  }
}
