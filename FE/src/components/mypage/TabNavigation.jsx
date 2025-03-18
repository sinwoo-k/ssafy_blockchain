import React from 'react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-4 flex border-b border-gray-800 mt-4">
      <button 
        className={`mr-6 pb-2 text-sm ${activeTab === '나의 NFT' ? 'border-b-2 border-[#3cc3ec] text-[#3cc3ec]' : 'text-gray-400'}`}
        onClick={() => onTabChange('나의 NFT')}
      >
        나의 NFT
      </button>
      <button 
        className={`mr-6 pb-2 text-sm ${activeTab === '거래 내역' ? 'border-b-2 border-[#3cc3ec] text-[#3cc3ec]' : 'text-gray-400'}`}
        onClick={() => onTabChange('거래 내역')}
      >
        거래 내역
      </button>
      <button 
        className={`mr-6 pb-2 text-sm ${activeTab === '관심 목록' ? 'border-b-2 border-[#3cc3ec] text-[#3cc3ec]' : 'text-gray-400'}`}
        onClick={() => onTabChange('관심 목록')}
      >
        관심 목록
      </button>
    </div>
  );
};

export default TabNavigation;