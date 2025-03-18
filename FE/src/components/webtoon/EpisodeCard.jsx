import React from 'react'
// 아이콘
import StarIcon from '@mui/icons-material/Star'

const EpisodeCard = ({ episode }) => {
  return (
    <div className='border-text flex h-[150px] items-center gap-10 border-b px-3'>
      {/* 썸네일 이미지 */}
      <div>
        <img
          src={episode.thumbnail}
          alt=''
          className='h-[100px] w-[200px] rounded-lg'
        />
      </div>
      {/* 회차 정보 */}
      <div className='flex h-[100px] flex-col justify-evenly'>
        <p className='text-xl'>{episode.title}</p>
        <div className='flex items-center gap-5 text-lg'>
          <span className='flex items-center gap-1'>
            <StarIcon sx={{ color: '#ffff19' }} />
            <span>4.56</span>
          </span>
          <span className='text-text/50'>{episode.uploadDate}</span>
        </div>
      </div>
    </div>
  )
}

export default EpisodeCard
