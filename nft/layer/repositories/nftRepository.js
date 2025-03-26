// repositories/nftRepository.js
import { pool } from '../../db/db.js';

export async function saveNftToDatabase({ webtoonId, userId, type, typeId, tokenId, contractAddress, metadataUri }) {
  const query = `
    INSERT INTO nft (webtoon_id, user_id, type, type_id, token_id, contract_address, metadata_uri)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [webtoonId, userId, type, typeId, tokenId, contractAddress, metadataUri]);
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
export async function getNftsByUserId(userId) {
  const query = 'SELECT * FROM nfts WHERE userId = ?';
  const nfts = await pool.query(query, [userId]);
  return nfts;
}
export async function getAllNfts() {
  const query = 'SELECT * FROM nfts';
  const nfts = await pool.query(query);
  return nfts;
}