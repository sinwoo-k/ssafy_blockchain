// layer/repositories/transactionRepository.js
import { pool } from '../../db/db.js';
import { ethers } from 'ethers';
import axios from 'axios';
import AppError from '../../utils/AppError.js';
import { RPC_URL, NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, ETHERSCAN_API_KEY } from '../config/contract.js';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const ETHERSCAN_BASE_URL = "https://api-holesky.etherscan.io/api";

/* ----- DB 접근 함수들 ----- */
export async function dbInsertTransactionLog(txData, contractAddress) {
  // 단순 DB 접근: 필수 값 검사나 비즈니스 로직은 서비스에서 처리
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
    ON DUPLICATE KEY UPDATE hash = hash;
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

  return pool.execute(query, params);
}

export async function dbGetTransactionLogs({ page, size }) {
  const offset = (page - 1) * size;
  const query = `
    SELECT * FROM contract_transactions 
    ORDER BY block_number DESC 
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.execute(query, [parseInt(size), parseInt(offset)]);
  return rows;
}

export async function dbGetLastSyncedBlock() {
  const query = `SELECT MAX(block_number) as lastBlock FROM contract_transactions`;
  const [rows] = await pool.execute(query);
  const lastBlock = rows[0].lastBlock;
  return lastBlock ? Number(lastBlock) : 0;
}

/* ----- 외부 API / 블록체인 접근 함수들 ----- */

export async function apiFetchWalletTransactions(walletAddress) {
  const apiKey = ETHERSCAN_API_KEY;
  const url = `${ETHERSCAN_BASE_URL}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=latest&sort=asc&apikey=${apiKey}`;
  const response = await axios.get(url);
  return response.data;
}

export async function bcFetchWalletNFTs(walletAddress) {
  const contract = new ethers.Contract(
    NFT_MARKETPLACE_ADDRESS,
    NFT_MARKETPLACE_ABI,
    provider
  );
  const balance = await contract.balanceOf(walletAddress);
  const tokens = [];
  for (let i = 0; i < balance; i++) {
    const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
    const tokenURI = await contract.tokenURI(tokenId);
    let metadata = null;
    try {
      const res = await axios.get(tokenURI);
      metadata = res.data;
    } catch (err) {
      console.error(`토큰 ${tokenId.toString()} 메타데이터 조회 실패:`, err.message);
    }
    tokens.push({
      tokenId: tokenId.toString(),
      metadata,
    });
  }
  return tokens;
}

export async function apiGetAllTransactionsForContract(contractAddress, fromBlock = "0", toBlock = "latest") {
  const apiKey = ETHERSCAN_API_KEY;
  let toBlockParam = toBlock;
  if (toBlock === "latest") {
    const latestBlock = await provider.getBlockNumber();
    toBlockParam = latestBlock.toString();
  }
  const url = `${ETHERSCAN_BASE_URL}?module=account&action=txlist&address=${contractAddress}&startblock=${fromBlock}&endblock=${toBlockParam}&sort=asc&apikey=${apiKey}`;
  const response = await axios.get(url);
  return response.data;
}

export async function bcGetTransactionReceipt(txHash) {
  const receipt = await provider.getTransactionReceipt(txHash);
  return receipt;
}

export async function bcGetSaleLogs() {
  const startBlock = 0;
  const endBlock = await provider.getBlockNumber();
  const maxChunkSize = 50000;
  let allLogs = [];
  for (let from = startBlock; from <= endBlock; from += maxChunkSize) {
    const to = Math.min(from + maxChunkSize - 1, endBlock);
    const chunkLogs = await provider.getLogs({
      address: NFT_MARKETPLACE_ADDRESS,
      fromBlock: ethers.toBigInt(from),
      toBlock: ethers.toBigInt(to),
      topics: [ethers.id("NFTSold(uint256,address,uint256)")]
    });
    allLogs = allLogs.concat(chunkLogs);
  }
  return allLogs;
}

export async function bcGetTransactionSender(txHash) {
  const tx = await provider.getTransaction(txHash);
  return tx?.from;
}
