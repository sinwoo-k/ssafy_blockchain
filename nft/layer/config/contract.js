// file: config/contract.js
import fs from 'fs';
import path from 'path';
import AppError from '../../utils/AppError.js';

// 스마트 컨트랙트 아티팩트 파일 경로 (배포 결과 파일)
const nftArtifactPath = path.join(process.cwd(), 'dist', 'contracts', 'NFTMarketplace.json');
let nftMarketplaceArtifact;
try {
  nftMarketplaceArtifact = JSON.parse(fs.readFileSync(nftArtifactPath, 'utf8'));
} catch (fsError) {
  console.error(`File Read/Parse Error: ${fsError.stack}`);
  throw new AppError('스마트 컨트랙트 아티팩트를 불러올 수 없습니다.', 500);
}
const walletArtifactPath = path.join(process.cwd(), 'dist', 'contracts', 'WalletManager.json');
let walletArtifact;
try {
  walletArtifact = JSON.parse(fs.readFileSync(walletArtifactPath, 'utf8'));
} catch (fsError) {
  console.error(`WalletManager Artifact Load Error: ${fsError.stack}`);
  throw new AppError('스마트 컨트랙트 아티팩트를 불러올 수 없습니다.', 500);
}

export const RPC_URL = process.env.RPC_URL;
export const WALLET_CONTRACT_ABI = walletArtifact.abi;
export const WALLET_CONTRACT_ADDRESS = process.env.WALLET_CONTRACT_ADDRESS;
export const WALLET_ARTIFACT = walletArtifact;

export const NFT_MARKETPLACE_ABI = nftMarketplaceArtifact.abi;
export const NFT_MARKETPLACE_ADDRESS = process.env.NFT_MARKETPLACE_ADDRESS;
export const NFT_MARKETPLACE_ARTIFACT = nftMarketplaceArtifact;

export const FIRST_SYNC_BLOCK = process.env.FIRST_SYNC_BLOCK;
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

export const CONTRACT_CONFIG = {
    NFT_MARKETPLACE_ADDRESS: process.env.NFT_MARKETPLACE_ADDRESS,
    WALLET_ADDRESS: process.env.WALLET_ADDRESS,
  };