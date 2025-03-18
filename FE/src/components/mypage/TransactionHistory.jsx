import React, { useState, useEffect } from 'react';
import { transactionData } from '../../pages/mypage/data';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // 실제 구현에서는 API 호출하여 거래 내역 데이터 가져오기
    fetchTransactionData();
  }, []);

  // 거래 내역 데이터 가져오기 (실제로는 API 호출)
  const fetchTransactionData = () => {
    // 데이터 로딩 시뮬레이션
    setTimeout(() => {
      setTransactions(transactionData);
    }, 300);
  };

  return (
    <div>
      {/* 테이블 헤더 */}
      <div className="mb-2 grid grid-cols-7 text-xs text-gray-400 border-b border-gray-800 pb-2">
        <div className="pl-2">아이템</div>
        <div>아이템 명</div>
        <div className="text-center">가격</div>
        <div className="text-center">수량</div>
        <div className="text-center">발신인</div>
        <div className="text-center">To</div>
        <div className="text-center">판매 일자</div>
      </div>

      {/* 거래 이력 목록 */}
      <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
        {transactions.length > 0 ? (
          transactions.map((item) => (
            <div key={item.id} className="grid grid-cols-7 items-center py-3 border-b border-gray-800">
              <div className="flex items-center pl-2">
                <div className="h-10 w-10 bg-gray-700 rounded"></div>
              </div>
              <div className="text-sm font-medium truncate pr-2">{item.name || '웹툰 이름'}</div>
              <div className="text-sm bg-gray-700 px-2 py-1 rounded text-center mx-auto w-[80px]">{item.price} ETH</div>
              <div className="text-sm text-center">{item.quantity}</div>
              <div className="text-sm text-center truncate" title={item.from}>{item.from}</div>
              <div className="text-sm text-center truncate" title={item.to}>{item.to}</div>
              <div className="text-sm text-center">{item.time}</div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-40 text-gray-500">
            거래 내역을 불러오는 중...
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;