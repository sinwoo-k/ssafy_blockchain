// repositories/nftRepository.js
import { pool } from '../../db/db.js';

export async function saveNftToDatabase({ webtoonId, userId, type, typeId, tokenId, imageUrl,contractAddress, metadataUri }) {
  // 현재 한국 시간으로 변환 (예: "2025-04-04 13:06:46")
  const now = new Date();
  now.setHours(now.getHours() + 9);  
  const query = `
    INSERT INTO nft (webtoon_id, user_id, type, type_id, token_id, image_url, contract_address, metadata_uri, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [webtoonId, userId, type, typeId, tokenId, imageUrl,contractAddress, metadataUri, now]);
  return { id: result.insertId };
}


export async function getFanartById(typeId) {
  const query = `
    SELECT * FROM fanart WHERE fanart_id = ?
  `;
  const [result] = await pool.execute(query, [typeId]);
  return result[0];
}

export async function getWebtoonById(webtoonId) {
  const query = `
    SELECT * FROM webtoon WHERE webtoon_id = ?
  `;  
  const [result] = await pool.execute(query, [webtoonId]);
  return result[0]; 
}

export async function getNftById(nftId) {
  const query = `
    SELECT * FROM nft WHERE nft_id = ?
  `;
  const [result] = await pool.execute(query, [nftId]);
  return result[0];
}

export async function getEpisodeById(typeId) {
  const query = `
    SELECT * FROM episode WHERE episode_id = ?
  `;
  const [result] = await pool.execute(query, [typeId]);
  return result[0];
}

export async function getGoodsById(typeId) {
  const query = `
    SELECT * FROM goods WHERE goods_id = ?
  `;
  const [result] = await pool.execute(query, [typeId]);
  return result[0];
}

export async function getNftCountByTypeId(type, type_id) {
  const query = `
    SELECT COUNT(*) AS count
      FROM nft
     WHERE type       = ?
       AND type_id    = ?
  `;
  const [rows] = await pool.execute(query, [type, type_id]);
  // rows[0].count 에서 count 컬럼을 꺼내서 반환
  return rows[0].count;
}