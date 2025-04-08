import React, { useState, useEffect } from 'react';
import userService from '../../api/userApi';

const BoughtMyNFT = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API 호출하여 구매 완료한 NFT 목록 데이터 가져오기
    fetchBoughtData();
  }, []);

  // 구매 완료한 NFT 데이터 가져오기
  const fetchBoughtData = async () => {
    try {
      setLoading(true);
      const response = await userService.BoughtMyNFT();
      if (response && response.content) {
        setAuctions(response.content || []);
      } else {
        setAuctions([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('구매 완료한 NFT 목록 로드 오류:', err);
      setError('구매 완료한 NFT 목록을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
      <div className="mb-2 grid grid-cols-5 text-xs text-gray-400 border-b border-gray-800 pb-2">
        <div className="pl-2">이미지</div>
        <div>작품명</div>
        <div className="text-center">구매 가격</div>
        <div className="text-center">판매자</div>
        <div className="text-center">구매 일자</div>
      </div>

      {/* 구매 완료한 NFT 목록 */}
      <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
        {auctions.length > 0 ? (
          auctions.map((item) => (
            <div key={item.auctionItemId || item.nftId} className="grid grid-cols-5 items-center py-3 border-b border-gray-800">
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
                {item.finalPrice || item.currentBiddingPrice} ETH
              </div>
              <div className="text-sm text-center truncate">
                {item.sellerName || item.seller || '판매자'}
              </div>
              <div className="text-sm text-center">
                {formatDate(item.purchaseDate || item.endTime || item.startTime)}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-40 text-gray-500">
            구매 완료한 NFT가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default BoughtMyNFT;