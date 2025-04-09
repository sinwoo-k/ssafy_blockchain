import React, { useState, useEffect } from 'react';
import NFTSellModal from './NFTSellModal';
import nftService from '../../api/nftApi';

const MyNFTList = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 판매 모달 상태
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);

  useEffect(() => {
    // API 호출하여 NFT 데이터 가져오기
    fetchMyNFTs();
  }, []);

  // 내 NFT 목록 가져오기
  const fetchMyNFTs = async () => {
    try {
      setLoading(true);
      const response = await nftService.getMyNFTs();
      console.log('받아온 NFT 목록:', response); // 데이터 확인용
      setTransactions(response || []);
      setLoading(false);
    } catch (err) {
      console.error('NFT 목록 로드 오류:', err);
      setError('NFT 목록을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  // #표시 이전까지의 제목만 추출하는 함수
  const extractTitleBeforeHash = (title) => {
    if (!title) return '';
    const hashIndex = title.lastIndexOf('#');
    return hashIndex !== -1 ? title.substring(0, hashIndex).trim() : title;
  };
  
  // NFT ID 추출 함수 (#숫자 형식)
  const extractNftNumber = (title) => {
    if (!title) return '';
    const match = title.match(/#(\d+)/);
    return match ? `#${match[1]}` : ''; // #을 포함하여 반환
  };

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
  const handleSellNft = async (sellInfo) => {
    try {
      // 선택된 NFT에서 nftId 확인
      if (!selectedNft || !selectedNft.nftId) {
        console.error('선택된 NFT에 nftId가 없습니다:', selectedNft);
        alert('유효한 NFT ID가 없습니다.');
        return;
      }
  
      // 판매 등록 API 요청 데이터
      const sellData = {
        nftId: selectedNft.nftId,
        minimumBidPrice: sellInfo.minimumBidPrice,
        buyNowPrice: sellInfo.buyNowPrice,
        endTime: sellInfo.endTime
      };
  
      console.log('판매 등록 요청 데이터:', sellData);
      
      // API 호출
      await nftService.sellNFT(sellData);
      
      alert('NFT가 판매 등록되었습니다.');
      
      // 판매중 상태 업데이트
      setTransactions(prev => 
        prev.map(item => 
          item.nftId === selectedNft.nftId 
            ? { ...item, onSale: true } 
            : item
        )
      );
      
      handleCloseSellModal();
    } catch (err) {
      console.error('NFT 판매 등록 오류:', err);
      alert('NFT 판매 등록에 실패했습니다.');
    }
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
        <div className="text-center">NFT 번호</div>
        <div className="col-span-3"></div> {/* 빈 칸 공간 */}
        <div className="text-center">상태</div>
      </div>

      {/* NFT 목록 */}
      <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((item) => (
            <div key={item.nftId || item.id} className="grid grid-cols-7 items-center py-3 border-b border-gray-800">
              <div className="flex items-center pl-1">
                <div className="h-10 w-10 bg-gray-700 rounded overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-700"></div>
                  )}
                </div>
              </div>
              <div className="text-sm font-medium truncate pr-2">
                {extractTitleBeforeHash(item.title) || '웹툰 이름'}
              </div>
              <div className="text-sm bg-gray-700 px-2 py-1 rounded text-center mx-auto w-[80px]">
                {extractNftNumber(item.title) || '-'}
              </div>
              <div className="col-span-3"></div> {/* 빈 칸 공간 */}
              <div className="text-center">
                {item.onSale ? (
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">입찰 중</span>
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
            {searchTerm ? '검색 결과가 없습니다.' : 'NFT가 없습니다.'}
          </div>
        )}
      </div>
      
      {/* NFT 판매 모달 */}
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