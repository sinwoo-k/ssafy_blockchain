import React from 'react'
// 아이콘
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ReorderIcon from '@mui/icons-material/Reorder'

const WebtoonViewerNavBar = ({ title, webtoon }) => {
  return (
    <div className='border-text/50 fixed top-[80px] h-[80px] w-full border-b bg-black'>
      <div className='flex h-full justify-between px-5'>
        {/* 정보 */}
        <div className='flex items-center gap-5 text-2xl'>
          <span>{webtoon}</span>
          <span> | </span>
          <span>{title}</span>
        </div>
        {/* 버튼 */}
        <div className='flex items-center gap-10 text-2xl'>
          <button className='flex cursor-pointer justify-center gap-1'>
            <ArrowBackIosNewIcon sx={{ fontSize: 30 }} />
            <span>이전화</span>
          </button>
          <button className='flex cursor-pointer justify-center gap-2'>
            <ReorderIcon sx={{ fontSize: 30 }} />
            <span>목록</span>
          </button>
          <button className='flex cursor-pointer justify-center gap-1'>
            <span>다음화</span>
            <ArrowForwardIosIcon sx={{ fontSize: 30 }} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default WebtoonViewerNavBar
