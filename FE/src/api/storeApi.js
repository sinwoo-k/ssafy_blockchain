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
  if (!webtoonId) {
    throw new Error('웹툰 ID는 필수 파라미터입니다.');
  }
  
  const response = await API.get(`/auctions/episodes?webtoonId=${webtoonId}&ended=${ended}`);
  return response.data;
};

/** 굿즈 경매 목록 조회 */
export const getGoodsAuctions = async (webtoonId, ended = '') => {
  if (!webtoonId) {
    throw new Error('웹툰 ID는 필수 파라미터입니다.');
  }
  
  let url = `/auctions/goods?webtoonId=${webtoonId}`;
  if (ended) {
    url += `&ended=${ended}`;
  }
  
  const response = await API.get(url);
  return response.data;
};

/** 팬아트 경매 목록 조회 */
export const getFanartAuctions = async (webtoonId, ended = '') => {
  if (!webtoonId) {
    throw new Error('웹툰 ID는 필수 파라미터입니다.');
  }
  
  let url = `/auctions/fanarts?webtoonId=${webtoonId}`;
  if (ended) {
    url += `&ended=${ended}`;
  }
  
  const response = await API.get(url);
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
  getNFTInfo 
};