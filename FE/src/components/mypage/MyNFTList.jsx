import React from 'react';

const MyNFTList = ({ transactions, onSellNft }) => {
  return (
    <div>
      {/* 검색창 */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="검색"
            className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 pr-10"
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
        <div>아이템</div>
        <div>아이템 명</div>
        <div>가격</div>
        <div>최근 거래가</div>
        <div>마켓 플레이스</div>
        <div>최종 일자</div>
        <div></div>
      </div>

      {/* NFT 목록 */}
      <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
        {transactions.map((item) => (
          <div key={item.id} className="grid grid-cols-7 items-center py-3 border-b border-gray-800">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gray-700 rounded"></div>
            </div>
            <div className="text-sm">웹툰 이름</div>
            <div className="text-sm bg-gray-700 px-2 py-1 rounded text-center">{item.price} ETH</div>
            <div className="text-sm">{item.ethPrice} ETH</div>
            <div className="text-sm">{item.marketplace}</div>
            <div className="text-sm">{item.time}</div>
            <div>
              <button 
                className="bg-[#3cc3ec] text-black px-3 py-1 rounded-md text-xs"
                onClick={() => onSellNft(item.id)}
              >
                판매
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNFTList;