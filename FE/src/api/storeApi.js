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
export const getEpisodeAuctions = async (webtoonId) => {
  const response = await API.get(`/auctions/episodes?webtoonId=${webtoonId}`);
  return response.data;
};

export const getFanartDetail = async (webtoonId) => {
  const response = await API.get(`/auctions/fanarts?webtoonId=${webtoonId}`);
  return response.data;
};

export const getGoodsDetail = async (webtoonId) => {
  const response = await API.get(`/auctions/goods?webtoonId=${webtoonId}`);
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
  try {
    // 파라미터 복사
    const requestParams = { ...params };
    
    // genres 배열 처리 - 다중 선택 지원
    if (requestParams.genres && Array.isArray(requestParams.genres)) {
      // 장르 파라미터 구성
      const genreParams = requestParams.genres.map(genre => `genres=${encodeURIComponent(genre)}`).join('&');
      
      // 페이지 및 기타 파라미터 구성
      const otherParams = Object.entries(requestParams)
        .filter(([key]) => key !== 'genres')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      
      const queryString = [genreParams, otherParams].filter(Boolean).join('&');
      const url = `/webtoons/paginated${queryString ? `?${queryString}` : ''}`;
      
      console.log('웹툰 요청 URL:', url);
      const response = await API.get(url);
      return response.data; // 페이징 정보가 포함된 응답 전체 반환
    }
    
    // 일반적인 경우
    console.log('웹툰 API 요청 파라미터:', requestParams);
    const response = await API.get('/webtoons/paginated', { params: requestParams });
    return response.data; // 페이징 정보가 포함된 응답 전체 반환
  } catch (error) {
    console.error('웹툰 목록 조회 실패:', error);
    console.error('오류 상세:', error.response?.data || error.message);
    return { totalItems: 0, totalPages: 0, currentPage: 1, webtoons: [] };
  }
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
  getwebtoonAuctions,
  getGoodsDetail,
  getFanartDetail
};