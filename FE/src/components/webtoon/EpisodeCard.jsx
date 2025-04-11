import React from 'react'
// 아이콘
import StarIcon from '@mui/icons-material/Star'

const EpisodeCard = ({ episode }) => {
  return (
    <div className='border-text flex h-[100px] items-center gap-10 border-b px-3'>
      {/* 썸네일 이미지 */}
      <div>
        <img
          src={episode.thumbnail}
          alt=''
          className='min-h-[80px] w-[150px] rounded-lg object-cover'
          onError={(event) =>
            (event.target.src = `https://placehold.co/200x100?text=episode${episode.episodeId}`)
          }
        />
      </div>
      {/* 회차 정보 */}
      <div className='flex h-[80px] flex-col justify-evenly'>
        <p className=''>{episode.episodeName}</p>
        <div className='flex items-center gap-2'>
          <span className='flex items-center gap-1'>
            <StarIcon sx={{ color: '#ffff19' }} />
            <span className='inline-block w-[45px] translate-y-[1px] transform'>
              {(episode.rating / 2).toFixed(2)}
            </span>
          </span>
          <span className='text-text/50 inline-block translate-y-[1px] transform'>
            {episode.uploadDate}
          </span>
        </div>
      </div>
    </div>
  )
}

export default EpisodeCard
