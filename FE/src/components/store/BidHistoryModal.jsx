// BidHistoryModal.jsx
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const BidHistoryModal = ({ isOpen, onClose, bidHistory }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // 페이지네이션 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bidHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bidHistory.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-[600px] rounded-lg bg-white p-6 text-black shadow-xl border border-gray-200">
        {/* 모달 헤더 */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-xl font-bold">입찰 기록</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
        
        {/* 입찰 기록 테이블 */}
        <div className="mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-gray-600 font-medium">#</th>
                <th className="pb-3 text-left text-gray-600 font-medium">입찰 일시</th>
                <th className="pb-3 text-left text-gray-600 font-medium">사용자</th>
                <th className="pb-3 text-right text-gray-600 font-medium">가격</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3">{record.id}</td>
                  <td className="py-3">
                    {record.date} <span className="text-gray-500">{record.time}</span>
                  </td>
                  <td className="py-3 text-blue-600">{record.user}</td>
                  <td className="py-3 text-right font-medium">{record.price} ETH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 페이지네이션 */}
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => index + 1).map((pageNumber) => (
              <button 
                key={pageNumber}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                  currentPage === pageNumber 
                    ? 'bg-blue-500 text-white font-medium' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidHistoryModal;