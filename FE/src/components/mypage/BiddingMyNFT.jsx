import React, { useState, useEffect } from 'react';
import userService from '../../api/userApi';

const BiddingMyNFT = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API 호출하여 입찰 중인 NFT 목록 데이터 가져오기
    fetchBiddingData();
  }, []);

  // 입찰 중인 NFT 데이터 가져오기
  const fetchBiddingData = async () => {
    try {
      setLoading(true);
      const response = await userService.BidingMyNFT();
      if (response && response.content) {
        setAuctions(response.content || []);
      } else {
        setAuctions([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('입찰 중인 NFT 목록 로드 오류:', err);
      setError('입찰 중인 NFT 목록을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  // 남은 시간 계산 함수
  const calculateTimeLeft = (endTime) => {
    if (!endTime) return '정보 없음';
    
    const end = new Date(endTime);
    const now = new Date();
    
    if (now >= end) return '경매 종료';
    
    const diffTime = end - now;
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}일 ${hours}시간 ${minutes}분`;
  };

  // 최고 입찰자 여부 표시 함수
  const isHighestBidder = (item) => {
    // 이 부분은 API 응답에 따라 조정이 필요할 수 있습니다
    // 현재는 예시로 구현
    return item.isHighestBidder;
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#3cc3ec]"></div>
      </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className="flex justify-center items-center h-40 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* 테이블 헤더 */}
      <div className="mb-2 grid grid-cols-6 text-xs text-gray-400 border-b border-gray-800 pb-2">
        <div className="pl-2">이미지</div>
        <div>작품명</div>
        <div className="text-center">내 입찰가</div>
        <div className="text-center">현재 입찰가</div>
        <div className="text-center">상태</div>
        <div className="text-center">남은 시간</div>
      </div>

      {/* 입찰 중인 NFT 목록 */}
      <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
        {auctions.length > 0 ? (
          auctions.map((item) => (
            <div key={item.auctionItemId} className="grid grid-cols-6 items-center py-3 border-b border-gray-800">
              <div className="flex items-center pl-2">
                <div className="h-12 w-12 bg-gray-700 rounded overflow-hidden">
                  {item.itemImage ? (
                    <img src={item.itemImage} alt={item.webtoonName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-700"></div>
                  )}
                </div>
              </div>
              <div className="text-sm font-medium truncate pr-2">{item.webtoonName || 'NFT 이름'}</div>
              <div className="text-sm bg-gray-700 px-2 py-1 rounded text-center mx-auto w-[90px]">
                {item.myBidPrice || item.currentBiddingPrice} ETH
              </div>
              <div className="text-sm bg-gray-700 px-2 py-1 rounded text-center mx-auto w-[90px]">
                {item.currentBiddingPrice} ETH
              </div>
              <div className="text-sm text-center">
                {isHighestBidder(item) ? (
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">최고 입찰</span>
                ) : (
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">입찰 중</span>
                )}
              </div>
              <div className="text-sm text-center">{calculateTimeLeft(item.endTime)}</div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-40 text-gray-500">
            입찰 중인 NFT가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default BiddingMyNFT;