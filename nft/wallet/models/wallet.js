// wallet/model/wallet.js
const pool = require('../../db/db');

async function createWallet(walletData) {
  const { user_id, wallet_address, private_key, public_key, recovery_phrase, coin_type } = walletData;
  const [result] = await pool.execute(
    `INSERT INTO wallet (user_id, wallet_address, private_key, public_key, recovery_phrase, coin_type)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, wallet_address, private_key, public_key, recovery_phrase, coin_type]
  );
  return result.insertId;
}

module.exports = { createWallet };
