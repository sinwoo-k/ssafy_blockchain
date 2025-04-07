import React from 'react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-7 flex border-b border-gray-800 mt-2">
      <button 
        className={`mr-6 pb-2 text-sm ${activeTab === '나의 NFT' ? 'border-b-2 border-[#3cc3ec] text-[#3cc3ec]' : 'text-gray-400'}`}
        onClick={() => onTabChange('나의 NFT')}
      >
        나의 NFT
      </button>
      <button 
        className={`mr-6 pb-2 text-sm ${activeTab === '판매중인 아이템' ? 'border-b-2 border-[#3cc3ec] text-[#3cc3ec]' : 'text-gray-400'}`}
        onClick={() => onTabChange('판매중인 아이템')}
      >
        판매중인 아이템
      </button>
      <button 
        className={`mr-6 pb-2 text-sm ${activeTab === '입찰중인 아이템' ? 'border-b-2 border-[#3cc3ec] text-[#3cc3ec]' : 'text-gray-400'}`}
        onClick={() => onTabChange('입찰중인 아이템')}
      >
        입찰중인 아이템
      </button>
      <button 
        className={`mr-6 pb-2 text-sm ${activeTab === '구매 내역' ? 'border-b-2 border-[#3cc3ec] text-[#3cc3ec]' : 'text-gray-400'}`}
        onClick={() => onTabChange('구매 내역')}
      >
        구매 내역
      </button>
      <button 
        className={`mr-6 pb-2 text-sm ${activeTab === '판매 내역' ? 'border-b-2 border-[#3cc3ec] text-[#3cc3ec]' : 'text-gray-400'}`}
        onClick={() => onTabChange('판매 내역')}
      >
        판매 내역
      </button>
    </div>
  );
};

export default TabNavigation;