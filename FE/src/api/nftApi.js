import API from '../api/API.js'
import { ethers } from 'ethers';
import nftMarketplaceArtifact from '../contracts/NFTMarketplace.json'; // ABI JSON 파일 경로

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

// 메타마스크용 경매 등록 API
export const createAuctionMetamask = async (nftData) => {
  try {
    const response = await API.post('/auctions/metamask', nftData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateAuctionStatus = async (auctionItemId, status) => {
  try {
    const response = await API.post(`/auctions/${auctionItemId}/update-status`, null, {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error('경매 상태 업데이트 오류:', error);
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
    const url = `/blockchain/wallet-info`;
    const response = await API.get(url);
    
    // 응답 형식이 { walletAddress: "0x...", amount: 30 } 인 경우를 처리
    if (response.data) {
      return {
        walletAddress: response.data.walletAddress || '',
        amount: response.data.amount || 0
      };
    }
    
    // 오류 발생 시에도 최소한의 구조를 가진 객체 반환
    return {
      walletAddress: '',
      amount: 0
    };
  } catch (error) {
    console.error('지갑 정보 가져오기 오류:', error);
    // 오류 발생 시에도 최소한의 구조를 가진 객체 반환
    return {
      walletAddress: '',
      amount: 0
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

// ETH-KRW 환율 조회 (외부 API 사용)
const getEthKrwRate = async () => {
  try {
    // CoinGecko API를 사용하여 이더리움의 KRW 환율 조회
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,krw');
    const data = await response.json();
    return data.ethereum.krw;
  } catch (error) {
    console.error('ETH-KRW 환율 조회 오류:', error);
    // 오류 발생 시 기본값 반환
    return 4500000; // 기본값 (예시)
  }
};

// 1) 민팅 요청 → nonce/messageToSign
const mintNftMetamaskRequest = async (payload) => {
  // 예: POST /metamask/mint-request
  const response = await API.post('/blockchain/metamask/mint-request', payload);
  return response.data; // { needSignature: true, messageToSign: "..." }
};

// 2) 판매 등록 요청(경매 시작) - 메타마스크 (1단계)
const sellNFTMetamaskRequest = async (sellData) => {
  // 예: POST /metamask/sell-request
  const response = await API.post('/blockchain/metamask/sell-request', sellData);
  return response.data; // { needSignature: true, messageToSign: "..." }
};

// 3) 최종 서명 검증 + 트랜잭션 실행
const confirmSignature = async ({ userId, signature }) => {
  // 예: POST /confirm-signature
  const response = await API.post('/blockchain/metamask/confirm-signature', { userId, signature });
  return response.data; // 트랜잭션 영수증 or payload
};
// 3) 메타마스크로 실제 트랜잭션 전송
export const sendTransactionWithMetamask = async (metamaskPayload) => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  // signer(현재 메타마스크 계정) 주소를 가져옴
  const fromAddress = await signer.getAddress();

  // 'from' 필드를 넣어 트랜잭션 객체 생성
  const tx = {
    from: fromAddress,
    to: metamaskPayload.to,
    data: metamaskPayload.data,
    value: metamaskPayload.value || 0 // 필요하면 '0x...' 16진수
  };

  // 실제 트랜잭션 전송
  const txResponse = await signer.sendTransaction(tx);
  const receipt = await txResponse.wait();
  return receipt;
};

export const signMessageWithMetamask = async (messageToSign) => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }
  // 요청: eth_requestAccounts
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  // ethers.js provider/signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const signature = await signer.signMessage(messageToSign);
  return signature;
};
const recordMintToDb = async (mintRecord) => {
  // POST /nft/record-mint
  const response = await API.post('/blockchain/record-mint', mintRecord);
  return response.data;
};
export const NFT_MARKETPLACE_ABI = nftMarketplaceArtifact.abi;
export const nftService = {
  getMyNFTs,
  getNFTTradingHistory,
  sellNFT,
  getWalletInfo,
  mintNFT,
  getEthUsdRate,
  getEthKrwRate,
  mintNftMetamaskRequest,
  sellNFTMetamaskRequest,
  confirmSignature,
  sendTransactionWithMetamask,
  signMessageWithMetamask,
  recordMintToDb,
  createAuctionMetamask,
  updateAuctionStatus
};

export default nftService;