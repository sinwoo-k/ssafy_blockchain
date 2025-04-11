import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const NewFanartCard = ({ fanart }) => {
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
    <div
      className='mx-3'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <Link to={`/fanart/${fanart.fanartId}`} onClick={handleClick}>
        <div className='overflow-hidden rounded-lg border border-black/50'>
          <img
            src={fanart.fanartImage}
            alt='팬아트 이미지'
            className='h-[175px] w-[175px] rounded-lg object-cover
            transition-transform duration-150 ease-in-out hover:scale-105'
          />
        </div>
      </Link>
    </div>
  )
}

export default NewFanartCard
