// wallet/repositorie/walletRepository.js
const pool = require('../../db/db');

async function findWalletByEmail(user_email) {
    const [rows] = await pool.execute(
      `SELECT * FROM wallet WHERE user_email = ?`,
      [user_email]
    );
    return rows[0]; // 존재하면 wallet 객체, 없으면 undefined
  }
  
  async function createWallet(walletData) {
    const { user_email, wallet_address, private_key, public_key, recovery_phrase, coin_type } = walletData;
    const [result] = await pool.execute(
      `INSERT INTO wallet (user_email, wallet_address, private_key, public_key, recovery_phrase, coin_type)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_email, wallet_address, private_key, public_key, recovery_phrase, coin_type]
    );
    return result.insertId;
  }
  
  module.exports = { findWalletByEmail, createWallet };