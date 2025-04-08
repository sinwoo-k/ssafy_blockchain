// layer/repositories/transactionRepository.js
import { pool } from '../../db/db.js';
import { ethers } from 'ethers';
import axios from 'axios';
import AppError from '../../utils/AppError.js';
import { RPC_URL, NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, ETHERSCAN_API_KEY, FIRST_SYNC_BLOCK } from '../config/contract.js';
// import { fallbackProvider as provider } from '../config/provider.js';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const ETHERSCAN_BASE_URL = "https://api-holesky.etherscan.io/api";
const SOLD_TOPIC    = ethers.id("NFTSold(uint256,address,uint256)");

const contract = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, provider);
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
  const now = new Date();

  const query = `
    INSERT INTO contract_transactions 
      (block_number, block_hash, time_stamp, hash, nonce, transaction_index, \`from\`, \`to\`, value, gas, gas_price, contract_address, gas_used, input, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    now
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

    let onSale = false;
    let salePrice = "0.00000"; // Ether 단위 (기본값)

    try {
      const listing = await contract.listings(tokenId);
      if (listing.isListed) {
        onSale = true;
        // listing.price는 Wei 단위의 BigNumber
        const etherString = ethers.formatEther(listing.price); // 'ethers@6' 문법
        salePrice = parseFloat(etherString).toFixed(5);        // 소수점 5자리 제한
      }
    } catch (err) {
      console.error(`토큰 ${tokenId.toString()} 판매 정보 조회 실패:`, err.message);
    }

    tokens.push({
      tokenId: tokenId.toString(),
      metadata,
      onSale,
      salePrice, // 예: '0.12345'
    });
  }

  return tokens;
}

export async function apiGetAllTransactionsForContract(contractAddress, fromBlock = "0", toBlock = "latest") {
  const apiKey = ETHERSCAN_API_KEY;
  let toBlockParam = toBlock;
  fromBlock = FIRST_SYNC_BLOCK;
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

async function etherscanGetLogs(topic, fromBlock, toBlock) {
  const url = `${ETHERSCAN_BASE_URL}`
    + `?module=logs`
    + `&action=getLogs`
    + `&fromBlock=${fromBlock}`
    + `&toBlock=${toBlock}`
    + `&address=${NFT_MARKETPLACE_ADDRESS}`
    + `&topic0=${topic}`
    + `&apikey=${ETHERSCAN_API_KEY}`;
  console.log(`etherscanGetLogs URL: ${url}`);
  const { data } = await axios.get(url);
  if (data.status !== "1") {
    // status=0 이거나 에러 메시지인 경우 빈 배열로 처리
    return [];
  }
  return data.result;
}

/**
 * 전체 판매 완료(NFTSold) 로그(청크 처리)
 */
export async function bcGetSaleLogs(fromBlock = FIRST_SYNC_BLOCK, toBlock = 'latest') {
  if (toBlock === 'latest') {
    const latest = await provider.getBlockNumber();
    toBlock = latest.toString();
  }
  return etherscanGetLogs(SOLD_TOPIC, fromBlock, toBlock);
}

/**
 * 개인 지갑의 NFT 전송(Transfer) 이력 조회
 */
export async function getWalletNftTransfers(walletAddress, fromBlock = 0, toBlock = 'latest') {
  if (toBlock === 'latest') {
    const latest = await provider.getBlockNumber();
    toBlock = latest.toString();
  }
  const url = `${ETHERSCAN_BASE_URL}`
    + `?module=account`
    + `&action=tokennfttx`
    + `&address=${walletAddress}`
    + `&startblock=${fromBlock}`
    + `&endblock=${toBlock}`
    + `&sort=asc`
    + `&apikey=${ETHERSCAN_API_KEY}`;
  const { data } = await axios.get(url);
  if (data.status !== "1") {
    // 실패하거나 이력이 없으면 빈 배열
    return [];
  }
  return data.result;
}