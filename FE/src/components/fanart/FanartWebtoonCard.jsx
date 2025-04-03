import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const FanartWebtoonCard = ({ webtoon }) => {
  // 마우스를 누른 지점(X 좌표) 저장
  const [startX, setStartX] = useState(0)
  // 현재 드래그 중인지 여부
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e) => {
    // 드래그 시작 위치와 드래그 상태 초기화
    setStartX(e.clientX)
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    // 일정 거리(예: 5px) 이상 이동하면 드래그로 판별
    if (Math.abs(e.clientX - startX) > 5) {
      setIsDragging(true)
    }
  }
  const handleClick = (e) => {
    // 드래그 상태라면 링크 이동 막기
    if (isDragging) {
      e.preventDefault()
    }
  }

  return (
    <div className='flex justify-center'>
      <div>
        {/* 웹툰 대표이미지 */}
        <div
          className='border-chaintoon mb-3 w-[200px] rounded-xl border'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          <Link
            to={`/fanart/webtoon/${webtoon.webtoonId}`}
            onClick={handleClick}
          >
            <img
              src={webtoon.seroThumbnail}
              alt={`${webtoon.webtoonName} 대표 이미지`}
              className='h-[250px] w-[200px] rounded-xl object-cover'
            />
          </Link>
        </div>
        {/* 웹툰 정보 */}
        <div className='px-2'>
          <h2 className='text-lg'>{webtoon.webtoonName}</h2>
          <p className='text-text/75 truncate'>{webtoon.writer}</p>
        </div>
      </div>
    </div>
  )
}

export default FanartWebtoonCard
