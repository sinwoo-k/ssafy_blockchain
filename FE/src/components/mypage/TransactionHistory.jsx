import React from 'react';

const TransactionHistory = ({ transactions }) => {
  return (
    <div>
      {/* 테이블 헤더 */}
      <div className="mb-2 grid grid-cols-7 text-xs text-gray-400 border-b border-gray-800 pb-2">
        <div>아이템</div>
        <div>아이템 명</div>
        <div>가격</div>
        <div>수량</div>
        <div>발신인</div>
        <div>To</div>
        <div>판매 일자</div>
      </div>

      {/* 거래 이력 목록 */}
      <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
        {transactions.map((item) => (
          <div key={item.id} className="grid grid-cols-7 items-center py-3 border-b border-gray-800">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gray-700 rounded"></div>
            </div>
            <div className="text-sm">웹툰 이름</div>
            <div className="text-sm bg-gray-700 px-2 py-1 rounded text-center">{item.price} ETH</div>
            <div className="text-sm">{item.quantity}</div>
            <div className="text-sm">{item.from}</div>
            <div className="text-sm">{item.to}</div>
            <div className="text-sm">{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;