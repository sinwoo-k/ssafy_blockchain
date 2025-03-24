import { pool } from '../../db/db.js';

export async function findWalletByEmail(user_email) {
  const [rows] = await pool.execute(
    `SELECT * FROM wallet WHERE user_email = ?`,
    [user_email]
  );
  return rows[0]; // 존재하면 wallet 객체, 없으면 undefined
}

export async function createWallet(walletData) {
  const {  user_email, wallet_address, private_key, public_key, recovery_phrase } = walletData;
  const [result] = await pool.execute(
    `INSERT INTO wallet (user_email, wallet_address, private_key, public_key, recovery_phrase)
     VALUES ( ?, ?, ?, ?, ?)`,
    [user_email, wallet_address, private_key, public_key, recovery_phrase]
  );
  return result.insertId;
}
