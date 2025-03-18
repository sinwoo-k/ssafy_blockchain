import React, { useState } from 'react';

const NFTSellModal = ({ isOpen, onClose, nft, onSell }) => {
  const [startPrice, setStartPrice] = useState('');
  const [endPrice, setEndPrice] = useState('');
  const [category, setCategory] = useState('웹툰');
  const [duration, setDuration] = useState('');
  
  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;
  
  // 판매 시작 가격 변경 핸들러
  const handleStartPriceChange = (e) => {
    // 숫자와 소수점만 허용
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setStartPrice(value);
  };
  
  // 판매 종료 가격 변경 핸들러
  const handleEndPriceChange = (e) => {
    // 숫자와 소수점만 허용
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setEndPrice(value);
  };
  
  // 카테고리 변경 핸들러
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  
  // 경매 기간 변경 핸들러
  const handleDurationChange = (e) => {
    // 숫자만 허용
    const value = e.target.value.replace(/[^0-9]/g, '');
    setDuration(value);
  };
  
  // 판매 등록 핸들러
  const handleSubmit = () => {
    // 필수값 검증
    if (!startPrice || !endPrice || !duration) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    
    // 판매 정보 객체 생성
    const sellInfo = {
      nftId: nft.id,
      startPrice: parseFloat(startPrice),
      endPrice: parseFloat(endPrice),
      category,
      duration: parseInt(duration),
    };
    
    // 부모 컴포넌트로 판매 정보 전달
    onSell(sellInfo);
    
    // 모달 닫기
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-[380px] rounded-md bg-[#1E1E1E] p-6 text-white">
        {/* 닫기 버튼 */}
        <button 
          className="absolute right-3 top-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* NFT 이미지 */}
        <div className="mb-4 flex justify-center">
          <div className="h-20 w-20 rounded-md bg-gray-700">
            {nft?.image ? (
              <img 
                src={nft.image} 
                alt={nft.title || 'NFT 이미지'} 
                className="h-full w-full object-cover rounded-md"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-700 rounded-md"></div>
            )}
          </div>
        </div>
        
        {/* 웹툰 이름 */}
        <h3 className="mb-4 text-center text-lg font-medium">
          {nft?.title || '웹툰 이름'}
        </h3>
        
        {/* 판매 양식 */}
        <div className="space-y-4">
          {/* 경매 시작 가격 */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">경매 시작 가격</label>
            <input
              type="text"
              value={startPrice}
              onChange={handleStartPriceChange}
              placeholder="ETH 단위로 입력"
              className="w-full rounded bg-gray-200 p-2 text-black"
            />
          </div>
          
          {/* 경매 시작 가격 */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">경매 시작 가격</label>
            <input
              type="text"
              value={endPrice}
              onChange={handleEndPriceChange}
              placeholder="ETH 단위로 입력"
              className="w-full rounded bg-gray-200 p-2 text-black"
            />
          </div>
          
          {/* 카테고리 */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">카테고리</label>
            <input
              type="text"
              value={category}
              onChange={handleCategoryChange}
              className="w-full rounded bg-gray-200 p-2 text-black"
            />
          </div>
          
          {/* 경매 기간 */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">경매 기간</label>
            <input
              type="text"
              value={duration}
              onChange={handleDurationChange}
              placeholder="일 단위로 입력"
              className="w-full rounded bg-gray-200 p-2 text-black"
            />
          </div>
          
          {/* 판매 버튼 */}
          <div className="pt-2 text-right">
            <button
              onClick={handleSubmit}
              className="rounded bg-[#3cc3ec] px-4 py-2 text-black font-medium hover:bg-[#2aabda]"
            >
              판매
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTSellModal;