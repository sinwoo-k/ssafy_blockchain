// repositories/nftRepository.js
import { pool } from '../../db/db.js';

/**
 * 특정 NFT 데이터를 조회합니다.
 * 예: { id, s3Url, title, description, ... }
 * S3 URL이 없는 경우 null 또는 빈 문자열을 반환합니다.
 */
export async function getNftData(nftId) {
  const [rows] = await pool.execute(
    'SELECT * FROM nft WHERE id = ?',
    [nftId]
  );
  return rows[0];
}
