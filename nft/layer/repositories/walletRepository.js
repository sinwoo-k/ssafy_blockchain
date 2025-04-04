import { pool } from '../../db/db.js';


export async function getWalletByUserId(userId) {
  const [result] = await pool.execute(
    `SELECT * FROM wallet WHERE user_id = ?`,
    [userId]
  );
  return result[0];
}

export async function createWallet(walletData) {
  const {
    userId = 0,
    walletAddress = "",
    privateKey = "",
    publicKey = "",
    recoveryPhrase = ""
  } = walletData;
  
  const [result] = await pool.execute(
    `INSERT INTO wallet (user_id, wallet_address, private_key, public_key, recovery_phrase)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, walletAddress, privateKey, publicKey, recoveryPhrase]
  );
  return result.insertId;
}

export async function createMetamaskWallet(walletAddress, userId) {
  // 전달받지 않은 값은 빈 문자열로 처리
  const privateKey = "";
  const publicKey = "";
  const recoveryPhrase = "";
  
  const [result] = await pool.execute(
    `INSERT INTO wallet (wallet_address, user_id, private_key, public_key, recovery_phrase)
     VALUES (?, ?, ?, ?, ?)`,
    [walletAddress, userId, privateKey, publicKey, recoveryPhrase]
  );
  return result.insertId;
}

export async function createUser(userData) {
  // 전달받은 값이 없으면 기본값을 설정합니다.
  const {
    email = "",
    nickname = "",
    introduction = "",
    profile_image = "",
    background_image = "",
    follower = 0,
    following = 0,
    url = "", // 빈칸
    join_date = new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0],    sso_type = "Metamask", // sso_type은 Metamask
    deleted = "N",
    status = "Y"
  } = userData;
  
  const [result] = await pool.execute(
    `INSERT INTO user (email, nickname, introduction, profile_image, background_image, follower, following, url, join_date, sso_type, deleted, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [email, nickname, introduction, profile_image, background_image, follower, following, url, join_date, sso_type, deleted, status]
  );
  return result.insertId;
}

export async function getWalletByAddress(walletAddress) {
  const query = `
    SELECT * FROM wallet WHERE wallet_address = ?
  `;  
  const [result] = await pool.execute(query, [walletAddress]);
  return result[0];
}

