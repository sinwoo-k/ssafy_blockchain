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
    const response = await API.post('/auctions', nftData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// NFT 등록
const mintNFT = async(payload) => {
  try{
    const response = await API.post(`/blockchain/mint`, payload);
    return response.data;
  } catch(error){
    throw error;
  }
};


// 지갑 정보 조회 (사용자 ID 파라미터 추가)
const getWalletInfo = async (userId) => {
  try {
    // userId는 항상 제공된다고 가정
    if (!userId) {
      console.error('유저 ID가 제공되지 않았습니다.');
      throw new Error('유저 ID는 필수입니다.');
    }
    
    // 상대 경로로 API 요청
    const url = `/nft/wallet-info/${userId}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error('지갑 정보 가져오기 오류:', error);
    // 오류 발생 시에도 최소한의 구조를 가진 객체 반환
    return {
      balances: {
        eth: '0 ETH'
      }
    };
  }
};

// ETH-USD 환율 조회 (외부 API 사용)
const getEthUsdRate = async () => {
  try {
    // CoinGecko API를 사용하여 이더리움의 USD 환율 조회
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    return data.ethereum.usd;
  } catch (error) {
    console.error('ETH-USD 환율 조회 오류:', error);
    // 오류 발생 시 기본값 반환
    return 3000; // 기본값
  }
};

export const nftService = {
  getMyNFTs,
  getNFTTradingHistory,
  sellNFT,
  getWalletInfo,
  mintNFT,
  getEthUsdRate
};

export default nftService;