// BidHistoryModal.jsx
import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { getAuctionDetail } from '../../api/storeApi';
import Loader from '../common/Loader';

const BidHistoryModal = ({ isOpen, onClose, auctionItemId }) => {
  const [bidHistory, setBidHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  
  // 입찰 기록 조회 함수
  useEffect(() => {
    // 모달이 열려있고 경매 아이템 ID가 있을 때만 데이터 조회
    if (isOpen && auctionItemId) {
      fetchBidHistory();
    }
  }, [isOpen, auctionItemId]);
  
  const fetchBidHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('입찰 기록 조회 시도:', auctionItemId);
      const historyData = await getAuctionDetail(auctionItemId);
      console.log('입찰 기록 응답:', historyData);
      
      // 응답 형식에 따른 데이터 추출
      let historyItems = [];
      if (Array.isArray(historyData)) {
        historyItems = historyData;
      } else if (historyData && historyData.content && Array.isArray(historyData.content)) {
        historyItems = historyData.content;
      } else {
        setError('입찰 기록을 불러올 수 없습니다.');
        setBidHistory([]);
        return;
      }
      
      // 입찰 순서 변경: 최신 입찰(가장 최근에 한 사람)이 1번이 되도록 정렬
      // sequence가 작은 값이 최신 입찰이거나, createdAt이 최신인 것이 앞으로 오도록 정렬
      const sortedHistory = [...historyItems].sort((a, b) => {
        // sequence 필드가 있으면 sequence로 정렬 (작은 값이 최신)
        if (a.sequence !== undefined && b.sequence !== undefined) {
          return a.sequence - b.sequence; // 오름차순 정렬
        }
        // sequence가 없으면 날짜로 정렬 (최신 날짜가 앞으로)
        return new Date(b.createdAt) - new Date(a.createdAt); // 내림차순으로 변경
      });
      
      setBidHistory(sortedHistory);
    } catch (err) {
      console.error('입찰 기록 조회 오류:', err);
      setError('입찰 기록을 불러오는 중 오류가 발생했습니다.');
      setBidHistory([]);
    } finally {
      setIsLoading(false);
    }
  };
  
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

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      
      // 년, 월, 일 포맷팅
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      // 시간 포맷팅 (오전/오후 표시)
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      const ampm = hours >= 12 ? '오후' : '오전';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0시는 12시로 표시
      
      return {
        date: `${year}. ${month}. ${day}.`,
        time: `${ampm} ${hours}:${minutes}:${seconds}`
      };
    } catch (e) {
      return { date: dateString, time: '' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
      <div className="w-[600px] rounded-lg bg-white p-6 text-black shadow-xl border border-gray-200">
        {/* 모달 헤더 */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-xl font-bold">입찰 기록</h2>
          <button 
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
        
        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader size="small" color="#3cc3ec" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
          </div>
        ) : bidHistory.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>입찰 기록이 없습니다.</p>
          </div>
        ) : (
          <>
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
                  {currentItems.map((record, index) => {
                    const { date, time } = formatDate(record.createdAt);
                    // 표시 번호는 현재 페이지의 시작 번호 + 인덱스 + 1
                    const displayNumber = indexOfFirstItem + index + 1;
                    return (
                      <tr key={record.sequence || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3">{displayNumber}</td>
                        <td className="py-3">
                          {date} {time}
                        </td>
                        <td className="py-3 text-blue-600">사용자 {record.userId}</td>
                        <td className="py-3 text-right font-medium">{record.biddingPrice?.toFixed(2)} ETH</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, index) => index + 1).map((pageNumber) => (
                    <button 
                      key={pageNumber}
                      className={`cursor-pointer w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BidHistoryModal;