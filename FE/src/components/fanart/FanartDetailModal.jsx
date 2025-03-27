import React from 'react'

// 아이콘
import CloseIcon from '@mui/icons-material/Close'

const FanartDetailModal = ({ isOpen, onClose, fanartImage }) => {
  return (
    <div
      // 모달 컨테이너(오버레이)
      className={`
        bg-opacity-50 fixed top-0 left-0 z-50 flex h-screen w-screen
        items-center justify-center bg-black/70
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}
      `}
      onClick={onClose} // 오버레이 클릭 시 모달 닫기
    >
      <div className='relative flex h-screen items-center justify-center px-30'>
        <div
          className={`
          rounded-xl transition-transform duration-300
          ${isOpen ? 'scale-100' : 'scale-50'}
        `}
          onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫히지 않도록 버블링 막기
        >
          <img
            src={fanartImage}
            alt='팬아트 이미지'
            className='w-[690px] rounded-lg'
          />
        </div>
        <div className='absolute right-5 bottom-5 mt-2 flex justify-center gap-5'>
          <button
            className='bg-text/75 hover:bg-text cursor-pointer rounded-full px-2 py-2 text-black/75 hover:text-black'
            onClick={onClose}
          >
            <CloseIcon sx={{ fontSize: 50 }} />
          </button>
        </div>
      </div>
      {/* 모달 내부 콘텐츠 */}
    </div>
  )
}

export default FanartDetailModal
