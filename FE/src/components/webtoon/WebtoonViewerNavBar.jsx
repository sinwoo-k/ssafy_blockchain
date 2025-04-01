import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getWebtoon } from '../../api/webtoonAPI'
// 아이콘
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ReorderIcon from '@mui/icons-material/Reorder'

const WebtoonViewerNavBar = ({
  title,
  webtoonId,
  webtoonName,
  prevEpisode,
  nextEpisode,
}) => {
  const navigate = useNavigate()

  const goPrev = () => {
    if (prevEpisode === 0) {
      alert('첫 에피소드 입니다.')
    } else {
      navigate(`/webtoon/episode/${prevEpisode}`)
    }
  }

  const goNext = () => {
    if (nextEpisode === 0) {
      alert('최신 에피소드 입니다.')
    } else {
      navigate(`/webtoon/episode/${nextEpisode}`)
    }
  }

  return (
    <div className='border-text/50 fixed top-[60px] z-10 h-[60px] w-full border-b bg-neutral-800'>
      <div className='flex h-full justify-between px-5'>
        {/* 정보 */}
        <div className='flex items-center gap-5 text-lg'>
          <span>{webtoonName}</span>
          <span> | </span>
          <span>{title}</span>
        </div>
        {/* 버튼 */}
        <div className='flex items-center gap-10'>
          <button
            className='flex cursor-pointer items-center justify-center gap-1'
            onClick={goPrev}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
            <span>이전화</span>
          </button>
          <Link to={`/webtoon/${webtoonId}`}>
            <button className='flex cursor-pointer items-center justify-center gap-2'>
              <ReorderIcon sx={{ fontSize: 20 }} />
              <span>목록</span>
            </button>
          </Link>
          <button
            className='flex cursor-pointer items-center justify-center gap-1'
            onClick={goNext}
          >
            <span>다음화</span>
            <ArrowForwardIosIcon sx={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default WebtoonViewerNavBar
