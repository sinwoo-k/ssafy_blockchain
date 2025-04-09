// storeApi.js 수정
import API from './API'

//** NFT 조회 **//
export const getNFTInfo = async (nftId) => {
  if (!nftId) {
    throw new Error('NFT ID는 필수 파라미터입니다.');
  }
  
  try {
    const response = await API.get(`/blockchain/nft-detail/${nftId}`);
    return response.data;
  } catch (error) {
    console.error('NFT 정보 조회 실패:', error);
    return null;
  }
};


/** 에피소드 경매 목록 조회 */
export const getEpisodeAuctions = async (webtoonId, ended = 'N') => {
  const response = await API.get(`/auctions/episodes?webtoonId=${webtoonId}&ended=${ended}`);
  return response.data;
};

// 공통 쿼리 파라미터 생성 함수 수정
const buildQueryString = (params) => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== '')
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        // 배열인 경우 같은 키를 여러 번 반복
        return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
      } else {
        // 일반 값인 경우
        return [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`];
      }
    })
    .join('&');
};

export const getwebtoonAuctions = async (params = {}) => {
  // buildQueryString 함수 사용해 쿼리 문자열 생성
  const queryString = buildQueryString(params);
  // URL 형식 수정 ('?' 뒤에 바로 쿼리 스트링 붙이기)
  const response = await API.get(queryString ? `/webtoons?${queryString}` : '/webtoons');
  return response.data;
};

export const getFanartAuctions = async (params = {}) => {
  const queryString = buildQueryString(params);
  // URL 형식 수정
  const response = await API.get(queryString ? `/auctions/fanarts?${queryString}` : '/auctions/fanarts');
  return response.data;
};

export const getGoodsAuctions = async (params = {}) => {
  const queryString = buildQueryString(params);
  // URL 형식 수정
  const response = await API.get(queryString ? `/auctions/goods?${queryString}` : '/auctions/goods');
  return response.data;
};

/** 경매 입찰기록 조회 */
export const getAuctionDetail = async (auctionItemId) => {
  if (!auctionItemId) {
    throw new Error('경매 ID는 필수 파라미터입니다.');
  }
  
  const response = await API.get(`/auctions/${auctionItemId}/bidding-history`);
  return response.data;
};

/** 입찰하기  */
export const placeBid = async (auctionId, bidAmount) => {
  if (!auctionId || !bidAmount) {
    throw new Error('경매 ID와 입찰 금액은 필수 파라미터입니다.');
  }
  
  const response = await API.post(`/auctions/bid`, { bidAmount });
  return response.data;
};

/** 즉시 구매하기*/
export const buyNow = async (auctionId) => {
  if (!auctionId) {
    throw new Error('경매 ID는 필수 파라미터입니다.');
  }
  
  const response = await API.post(`auctions/buy-now`);
  return response.data;
};

export default {
  getEpisodeAuctions,
  getGoodsAuctions,
  getFanartAuctions,
  getAuctionDetail,
  placeBid,
  buyNow,
  getNFTInfo,
  getwebtoonAuctions
};