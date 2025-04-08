import React, { useState, useEffect } from 'react'
import NoticeCard from './NoticeCard'

// 아이콘
import CloseIcon from '@mui/icons-material/Close'

const NoticeModal = ({ onClose, notices = [], patchData, hasMore }) => {
  const [animate, setAnimate] = useState(false)

  // 모달 마운트 시 애니메이션 시작
  useEffect(() => {
    setAnimate(true)

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    setAnimate(false)
    setTimeout(() => {
      onClose()
    }, 500)
  }

  const deleteAllData = async () => {
    if (!confirm('알림 전체를 삭제하시겠습니까?')) {
      return
    }
  }

  return (
    <div className='fixed inset-0 top-[60px] z-50 flex'>
      {/* 배경 오버레이: 클릭 시 모달 닫힘 */}
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={handleClose}
      ></div>
      {/* offcanvas 알림창 */}
      <div
        className={`relative ml-auto h-full w-80 transform bg-[#252525]/70 shadow-xl transition-transform duration-500 ${
          animate ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* 헤더: 고정 영역 */}
        <div className='flex items-center justify-between border-b p-4'>
          <h2 className='text-xl font-bold'>알림</h2>
          <div className='flex gap-3'>
            <button>전체삭제</button>
            <button
              onClick={handleClose}
              className='cursor-pointer hover:text-red-500'
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        {/* 내용 영역: 스크롤이 필요한 경우 자동 스크롤 */}
        <div className='no-scrollbar flex-1 overflow-y-auto p-4'>
          {notices.length > 0 ? (
            notices.map((notice) => (
              <NoticeCard key={notice.noticeId} notice={notice} />
            ))
          ) : (
            <p>알림이 없습니다.</p>
          )}
          {!hasMore && (
            <button
              className='hover:text-chaintoon w-full cursor-pointer'
              onClick={patchData}
            >
              더보기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NoticeModal
