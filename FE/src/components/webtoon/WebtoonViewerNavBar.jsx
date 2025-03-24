import React from 'react'
// 아이콘
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ReorderIcon from '@mui/icons-material/Reorder'

const WebtoonViewerNavBar = ({ title, webtoon }) => {
  return (
    <div className='border-text/50 fixed top-[60px] h-[60px] w-full border-b bg-neutral-800'>
      <div className='flex h-full justify-between px-5'>
        {/* 정보 */}
        <div className='flex items-center gap-5 text-lg'>
          <span>{webtoon}</span>
          <span> | </span>
          <span>{title}</span>
        </div>
        {/* 버튼 */}
        <div className='flex items-center gap-10'>
          <button className='flex cursor-pointer items-center justify-center gap-1'>
            <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
            <span>이전화</span>
          </button>
          <button className='flex cursor-pointer items-center justify-center gap-2'>
            <ReorderIcon sx={{ fontSize: 20 }} />
            <span>목록</span>
          </button>
          <button className='flex cursor-pointer items-center justify-center gap-1'>
            <span>다음화</span>
            <ArrowForwardIosIcon sx={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default WebtoonViewerNavBar
