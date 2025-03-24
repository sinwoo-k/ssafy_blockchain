import { redisClient } from '../../db/db.js';
import { v4 as uuidv4 } from 'uuid';

const redisCli = redisClient.v4; // Promise 기반 버전 사용

/**
 * 사용자 이메일 기반으로 새로운 nonce를 생성하여 Redis에 저장 (만료 시간: 5분)
 * @param {string} user_email
 * @returns {string} 생성된 nonce
 */
export async function generateAndStoreNonce(user_email) {
  const nonce = uuidv4();
  await redisCli.setEx("nonce:" + user_email, 300, nonce); // 300초 = 5분
  return nonce;
}

/**
 * 사용자 이메일에 해당하는 nonce를 Redis에서 조회
 * @param {string} user_email
 * @returns {string|null} nonce
 */
export async function getNonce(user_email) {
  console.log("User email:", user_email);
  const nonceValue = await redisCli.get("nonce:" + user_email);
  return nonceValue;
}

/**
 * 사용자 이메일에 해당하는 nonce를 Redis에서 삭제
 * @param {string} user_email
 */
export async function deleteNonce(user_email) {
  await redisCli.del("nonce:" + user_email);
}
