import { pool } from '../../db/db.js';
import { ethers } from 'ethers';
import AppError from '../../utils/AppError.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONTRACT_CONFIG } from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const artifactPath = path.join(__dirname, '..', '..', 'dist', 'contracts', 'NFTMarketplace.json');
const NFTMarketplaceArtifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const NFT_MARKETPLACE_ADDRESS = CONTRACT_CONFIG.NFT_MARKETPLACE_ADDRESS;

export async function createWallet(walletData) {
  const {  userId, walletAddress, privateKey, publicKey, recoveryPhrase } = walletData;
  const [result] = await pool.execute(
    `INSERT INTO wallet (user_id, wallet_address, private_key, public_key, recovery_phrase)
     VALUES ( ?, ?, ?, ?, ?)`,
    [userId, walletAddress, privateKey, publicKey, recoveryPhrase]
  );
  return result.insertId;
}

export async function getWalletByUserId(userId) {
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
    `INSERT INTO user (email, nickname, introduction, profile_image, background_image, follower, following, join_date, deleted ,status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["", nickname, "", "", "", 0, 0, joinDate, deleted, "Y"]
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

/**
 * Etherscan API를 사용하여 특정 지갑의 거래 내역을 조회
 */
export async function fetchWalletTransactions(walletAddress) {
  try {
    const apiKey = process.env.ETHERSCAN_API_KEY;
    if (!apiKey) {
      throw new AppError("Etherscan API 키가 제공되지 않았습니다.", 500);
    }
    const ETHERSCAN_BASE_URL = "https://api-holesky.etherscan.io/api";
    const url = `${ETHERSCAN_BASE_URL}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=latest&sort=asc&apikey=${apiKey}`;
    const response = await axios.get(url);
    if (response.data.status !== "1") {
      throw new AppError("Etherscan 오류: " + response.data.message, 500);
    }
    const filtered = response.data.result.filter(tx => {
      // 거래의 to 필드나 contractAddress 필드를 사용하여 필터링할 수 있습니다.
      return tx.to && tx.to.toLowerCase() === NFT_MARKETPLACE_ADDRESS.toLowerCase();
    });
    return filtered;
  } catch (error) {
    throw new AppError("지갑 거래 내역 조회 실패: " + error.message, 500);
  }
}

/**
 * ERC721Enumerable 인터페이스를 이용하여 지갑이 보유한 NFT 목록 조회
 */
export async function fetchWalletNFTs(walletAddress) {
  try {
    if (!NFT_MARKETPLACE_ADDRESS) {
      throw new AppError("NFT 컨트랙트 주소가 제공되지 않았습니다.", 500);
    }

    // ABI와 주소로 컨트랙트 인스턴스 생성
    const contract = new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS,
      NFTMarketplaceArtifact.abi,
      provider
    );

    // balanceOf로 NFT 개수 조회
    const balance = await contract.balanceOf(walletAddress);
    const tokens = [];

    for (let i = 0; i < balance; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
      const tokenURI = await contract.tokenURI(tokenId);
      let metadata = null;
      try {
        // tokenURI가 HTTP(S) URL인 경우 메타데이터를 가져옴
        const res = await axios.get(tokenURI);
        metadata = res.data;
      } catch (err) {
        console.error(`토큰 ${tokenId.toString()} 메타데이터 조회 실패:`, err.message);
      }
      tokens.push({
        tokenId: tokenId.toString(),
        tokenURI,
        metadata,
      });
    }

    return tokens;
  } catch (error) {
    throw new AppError("NFT 보유 목록 조회 실패: " + error.message, 500);
  }
}