import API from '../api/API.js'


// 내 NFT 목록 조회
const getMyNFTs = async () => {
  try {
    const response = await API.get('blockchain/nft-list');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// NFT 상세 정보 조회
const getNFTDetails = async (tokenId) => {
  try {
    const response = await API.get(`/nft/nft-details/${tokenId}`, {
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
    const response = await API.get(`/nfts/${nftId}/trading-histories`, {
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
    const response = await API.post('/blockchain/mint', nftData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 내 거래 내역 조회
const getMyTradingHistory = async () => {
  try {
    const response = await API.get('/users/trading-histories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 지갑 정보 조회
const getWalletInfo = async () => {
  try {
    const response = await API.get('/nft/wallet-info');
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