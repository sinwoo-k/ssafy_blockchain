import React, { useState, useEffect } from 'react';
import NFTSellModal from './NFTSellModal';
import { nftData } from '../../pages/mypage/data';

const MyNFTList = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 판매 모달 상태
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);

  useEffect(() => {
    // 실제 구현에서는 API 호출하여 NFT 데이터 가져오기
    setTransactions(nftData);
  }, []);

  // NFT 판매 버튼 클릭 핸들러
  const handleSellClick = (nft) => {
    setSelectedNft(nft);
    setShowSellModal(true);
  };
  
  // 판매 모달 닫기 핸들러
  const handleCloseSellModal = () => {
    setShowSellModal(false);
    setSelectedNft(null);
  };
  
  // NFT 판매 처리 핸들러
  const handleSellNft = (sellInfo) => {
    console.log('NFT 판매 정보:', sellInfo);
    // 실제 구현에서는 판매 API 호출
    
    // 판매 중인 상태로 UI 업데이트
    setTransactions(prev => 
      prev.map(item => 
        item.id === sellInfo.nftId
          ? { ...item, isOnSale: true, sellInfo }
          : item
      )
    );
  };

  // 검색어 입력 처리
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색어로 필터링된 NFT 목록
  const filteredTransactions = transactions.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.owner?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* 검색창 */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="검색"
            className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 pr-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 테이블 헤더 */}
      <div className="mb-2 grid grid-cols-7 text-xs text-gray-400 border-b border-gray-800 pb-2">
        <div className="pl-2">아이템</div>
        <div>아이템 명</div>
        <div className="text-center">가격</div>
        <div className="text-center">최근 거래가</div>
        <div className="text-center">소유자</div>
        <div className="text-center">최종 일자</div>
        <div className="text-center">작업</div>
      </div>

      {/* NFT 목록 */}
      <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((item) => (
            <div key={item.id} className="grid grid-cols-7 items-center py-3 border-b border-gray-800">
              <div className="flex items-center pl-2">
                <div className="h-10 w-10 bg-gray-700 rounded"></div>
              </div>
              <div className="text-sm font-medium truncate pr-2">{item.title || '웹툰 이름'}</div>
              <div className="text-sm bg-gray-700 px-2 py-1 rounded text-center mx-auto w-[80px]">{item.price} ETH</div>
              <div className="text-sm text-center">{item.ethPrice} ETH</div>
              <div className="text-sm text-center">{item.owner}</div>
              <div className="text-sm text-center">{item.time}</div>
              <div className="text-center">
                {item.isOnSale ? (
                  <span className="text-xs text-[#3cc3ec]">판매 중</span>
                ) : (
                  <button 
                    className="bg-[#3cc3ec] text-black px-3 py-1 rounded-md text-xs"
                    onClick={() => handleSellClick(item)}
                  >
                    판매
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
      
      {/* NFT 판매 모달 - 별도 컴포넌트로 분리 */}
      <NFTSellModal 
        isOpen={showSellModal}
        onClose={handleCloseSellModal}
        nft={selectedNft}
        onSell={handleSellNft}
      />
    </div>
  );
};

export default MyNFTList;