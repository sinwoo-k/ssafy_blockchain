import React from 'react'

const MyWebtoonCard = ({ webtoon }) => {
  return (
    <div className='border-text flex h-[100px] items-center gap-10 border-b px-3'>
      {/* 썸네일 이미지 */}
      <div>
        <img
          src={webtoon.cover}
          alt=''
          className='h-auto w-[150px] rounded-lg'
        />
      </div>
      {/* 회차 정보 */}
      <div className='flex h-[80px] flex-col justify-evenly'>
        <p className=''>{webtoon.title}</p>
        <div className='flex items-center gap-5'>
          <span className='flex items-center gap-1'>
            <StarIcon sx={{ color: '#ffff19' }} />
            <span className='inline-block w-[45px] translate-y-[1px] transform'>
              4.56
            </span>
          </span>
          <span className='text-text/50'>{webtoon.episodeCount} 화</span>
        </div>
      </div>
    </div>
  )
}

export default MyWebtoonCard
