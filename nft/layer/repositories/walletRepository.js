import { pool } from '../../db/db.js';

export async function createWallet(walletData) {
  const {  userId, walletAddress, privateKey, publicKey, recoveryPhrase } = walletData;
  const [result] = await pool.execute(
    `INSERT INTO wallet (user_id, wallet_address, private_key, public_key, recovery_phrase)
     VALUES ( ?, ?, ?, ?, ?)`,
    [userId, walletAddress, privateKey, publicKey, recoveryPhrase]
  );
  return result.insertId;
}

export async function findWalletByUserId(userId) {
  const [result] = await pool.execute(
    `SELECT * FROM wallet WHERE user_id = ?`,
    [userId]
  );
  return result[0];
}

export async function createMetamaskWallet(walletAddress, userId) {
  const [result] = await pool.execute(
    `INSERT INTO wallet (wallet_address, user_id)
     VALUES (?, ?)`,
    [walletAddress, userId]
  );
  return result.insertId;
}

export async function createUser(userData){
  const { nickname , joinDate, deleted } = userData;
  const [result] = await pool.execute(
    `INSERT INTO user (email, nickname, introduction, profile_image, background_image, follwer, following, join_date, deleted ,status)
     VALUES (?, ?, ?)`,
    ["", nickname, "", "", "", 0, 0, joinDate, deleted, "Y"]
  );
  return result.insertId;
}

export async function findWalletByAddress(walletAddress) {
  const [result] = await pool.execute(
    `SELECT * FROM wallet WHERE wallet_address = ?`,
    [walletAddress]
  );
  return result;
}