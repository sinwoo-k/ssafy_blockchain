import React, { useState, useEffect } from 'react';

const NFTSellModal = ({ isOpen, onClose, nft, onSell }) => {
  const [startPrice, setStartPrice] = useState('');
  const [endPrice, setEndPrice] = useState('');
  const [category, setCategory] = useState('액션');
  const [auctionEndDate, setAuctionEndDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('12');
  
  // 카테고리 목록
  const categories = [
    '액션', '로맨스', '판타지', '개그', '스릴러', 
    '드라마', '일상', '무협/사극', '스포츠', '감성'
  ];
  
  // 시간 옵션 생성 (1시부터 24시까지)
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i + 1;
    return hour <= 24 ? hour.toString() : null;
  }).filter(Boolean);
  
  // 모달이 열릴 때 초기값 설정
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      // 7일 후의 날짜 계산
      const futureDate = new Date(now);
      futureDate.setDate(futureDate.getDate() + 7);
      
      // yyyy-MM-dd 형식으로 변환 (로컬 시간)
      const formattedDate = futureDate.toISOString().split('T')[0];
      setAuctionEndDate(formattedDate);
      
      // 기본 시간 설정 (12시)
      setSelectedTime('12');
      
      // 가격 필드 초기화 (실제 구현에서는 기본값 설정 가능)
      setStartPrice('');
      setEndPrice('');
    }
  }, [isOpen]);
  
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
  
  // 날짜 변경 핸들러
  const handleDateChange = (e) => {
    setAuctionEndDate(e.target.value);
  };
  
  // 시간 변경 핸들러
  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };
  
  // 판매 등록 핸들러
  const handleSubmit = () => {
    // 필수값 검증
    if (!startPrice || !endPrice || !auctionEndDate || !selectedTime) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    
    // 날짜와 시간을 결합하여 Date 객체 생성
    const endDateTime = new Date(`${auctionEndDate}T${selectedTime}:00:00`);
    const now = new Date();
    
    if (endDateTime <= now) {
      alert('경매 종료 일시는 현재 시간 이후로 설정해야 합니다.');
      return;
    }
    
    // 판매 정보 객체 생성
    const sellInfo = {
      nftId: nft.id,
      startPrice: parseFloat(startPrice),
      endPrice: parseFloat(endPrice),
      category,
      auctionEndDate: endDateTime.toISOString(),
      // 경매 기간 (일) 계산
      duration: Math.ceil((endDateTime - now) / (1000 * 60 * 60 * 24))
    };
    
    // 부모 컴포넌트로 판매 정보 전달
    onSell(sellInfo);
    
    // 모달 닫기
    onClose();
  };

  // 선택한 날짜와 시간으로 경매 기간 (일) 계산
  const calculateDuration = () => {
    if (!auctionEndDate) return 0;
    
    const endDateTime = new Date(`${auctionEndDate}T${selectedTime}:00:00`);
    const now = new Date();
    return Math.ceil((endDateTime - now) / (1000 * 60 * 60 * 24));
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
          
          {/* 경매 종료 가격 */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">즉시 구매 가격</label>
            <input
              type="text"
              value={endPrice}
              onChange={handleEndPriceChange}
              placeholder="ETH 단위로 입력"
              className="w-full rounded bg-gray-200 p-2 text-black"
            />
          </div>
          
          {/* 카테고리 - 드롭다운으로 변경 */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">카테고리</label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full rounded bg-gray-200 p-2 text-black"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {/* 경매 기간 설정 */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">경매 종료일</label>
            <div className="flex space-x-2">
              {/* 날짜 선택 */}
              <div className="relative flex-grow">
                <div className="flex items-center">
                  <input
                    type="date"
                    value={auctionEndDate}
                    onChange={handleDateChange}
                    className="w-full rounded bg-gray-200 p-2 text-black"
                  />
                  <div className="absolute right-2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* 시간 선택 (드롭다운) */}
              <div className="w-24">
                <select
                  value={selectedTime}
                  onChange={handleTimeChange}
                  className="w-full rounded bg-gray-200 p-2 text-black"
                >
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}시
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* 예상 경매 기간 표시 */}
            <p className="mt-1 text-xs text-gray-400">
              경매 기간: 약 {calculateDuration()}일
            </p>
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