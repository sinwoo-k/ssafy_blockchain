// repositories/nftRepository.js
import { pool } from '../../db/db.js';

export async function saveNftToDatabase({ webtoonId, userId, type, typeId, tokenId, contractAddress, metadataUri }) {
  // 현재 한국 시간으로 변환 (예: "2025-04-04 13:06:46")
  const koreaTime = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  
  const query = `
    INSERT INTO nft (webtoon_id, user_id, type, type_id, token_id, contract_address, metadata_uri, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [webtoonId, userId, type, typeId, tokenId, contractAddress, metadataUri, koreaTime]);
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