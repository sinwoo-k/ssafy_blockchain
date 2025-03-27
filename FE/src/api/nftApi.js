// src/utils/API/nftApi.js - NFT 관련 API
import API from './API';

// 내 NFT 목록 조회
const getMyNFTs = async () => {
  try {
    const response = await API.get('/api/nft/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// NFT 상세 정보 조회
const getNFTDetails = async (tokenId) => {
  try {
    const response = await API.get(`/api/nft/nft-details/${tokenId}`, {
      params: { type: 'nft' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// NFT 거래 내역 조회
const getNFTTradingHistory = async (nftId) => {
  try {
    const response = await API.get(`/api/nfts/${nftId}/trading-histories`, {
      params: { type: 'nft' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// NFT 판매 등록
const sellNFT = async (nftData) => {
  try {
    const response = await API.post('/api/nft/sell-nft', nftData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 내 거래 내역 조회
const getMyTradingHistory = async () => {
  try {
    const response = await API.get('/api/users/trading-histories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 지갑 정보 조회
const getWalletInfo = async () => {
  try {
    const response = await API.get('/api/nft/wallet-info');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const nftService = {
  getMyNFTs,
  getNFTDetails,
  getNFTTradingHistory,
  sellNFT,
  getMyTradingHistory,
  getWalletInfo
};

export default nftService;