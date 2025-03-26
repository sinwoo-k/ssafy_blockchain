import { redisClient } from '../../db/db.js';
import { v4 as uuidv4 } from 'uuid';

const redisCli = redisClient.v4; // Promise 기반 버전 사용

/**
 * 지갑 주소 기반으로 새로운 nonce를 생성하여 Redis에 저장 (만료 시간: 5분)
 * @param {string} walletAddress
 * @returns {string} 생성된 nonce
 */
export async function generateAndStoreNonce(walletAddress) {
  const nonce = uuidv4();
  await redisCli.setEx("nonce:" + walletAddress, 300, nonce); // 300초 = 5분
  return nonce;
}

/**
 * 지갑 주소에 해당하는 nonce를 Redis에서 조회
 * @param {string} walletAddress
 * @returns {string|null} nonce
 */
export async function getNonce(walletAddress) {
  const nonceValue = await redisCli.get("nonce:" + walletAddress);
  return nonceValue;
}

/**
 * 지갑 주소에 해당하는 nonce를 Redis에서 삭제
 * @param {string} walletAddress
 */
export async function deleteNonce(walletAddress) {
  await redisCli.del("nonce:" + walletAddress);
}
