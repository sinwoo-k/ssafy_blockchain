import { pool } from '../../db/db.js'; // DB 연결 설정 파일 (mysql2/promise 사용)

// contract_transactions 테이블에 insert할 때, 필수값(from, hash)만 있을 경우에만 저장합니다.
export async function insertTransactionLog(txData, contractAddress) {
  // 필수 필드가 없으면 저장하지 않음
  if (!txData.from || !txData.hash) return;

  // insert할 데이터 구성 (값이 있으면 넣고 없으면 null)
  const data = {
    block_number: txData.blockNumber || null,
    block_hash: txData.blockHash || null,
    time_stamp: txData.timeStamp || null,
    hash: txData.hash,
    nonce: txData.nonce || null,
    transaction_index: txData.transactionIndex || null,
    from: txData.from,
    to: txData.to || null,
    value: txData.value || null,
    gas: txData.gas || null,
    gas_price: txData.gasPrice || null,
    contract_address: contractAddress || txData.contractAddress || null,
    gas_used: txData.gasUsed || null,
    input: txData.input || null,
  };

  const query = `
    INSERT INTO contract_transactions 
      (block_number, block_hash, time_stamp, hash, nonce, transaction_index, \`from\`, \`to\`, value, gas, gas_price, contract_address, gas_used, input)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE hash = hash;  -- 중복시 업데이트 없이 무시
  `;
  const params = [
    data.block_number,
    data.block_hash,
    data.time_stamp,
    data.hash,
    data.nonce,
    data.transaction_index,
    data.from,
    data.to,
    data.value,
    data.gas,
    data.gas_price,
    data.contract_address,
    data.gas_used,
    data.input,
  ];

  try {
    await pool.execute(query, params);
  } catch (error) {
    console.error("Error inserting transaction log:", error);
    throw error;
  }
}

// 페이지네이션으로 트랜잭션 로그 조회
export async function getTransactionLogs({ page, size }) {
  const offset = (page - 1) * size;
  const query = `
    SELECT * FROM contract_transactions 
    ORDER BY block_number DESC 
    LIMIT ? OFFSET ?
  `;
  try {
    const [rows] = await pool.execute(query, [parseInt(size), parseInt(offset)]);
    return rows;
  } catch (error) {
    console.error("Error fetching transaction logs:", error);
    throw error;
  }
}

// 마지막 동기화된 블록 번호 조회 (테이블의 최대 block_number)
export async function getLastSyncedBlock() {
  const query = `SELECT MAX(block_number) as lastBlock FROM contract_transactions`;
  try {
    const [rows] = await pool.execute(query);
    const lastBlock = rows[0].lastBlock;
    return lastBlock ? Number(lastBlock) : 0;
  } catch (error) {
    console.error("Error fetching last synced block:", error);
    throw error;
  }
}
