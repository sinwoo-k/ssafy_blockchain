import React from 'react'

// 아이콘
import StarIcon from '@mui/icons-material/Star'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Link } from 'react-router-dom'

const MyEpisodeCard = ({ episode }) => {
  return (
    <div className='border-text flex h-[100px] items-center gap-10 border-b px-3'>
      {/* 썸네일 이미지 */}
      <div className='flex-none'>
        <img
          src={episode.thumbnail}
          alt=''
          className='h-auto w-[150px] rounded-lg'
        />
      </div>
      {/* 회차 정보 */}
      <div className='flex h-[80px] grow flex-col justify-evenly'>
        <p className=''>{episode.title}</p>
        <div className='flex w-full justify-between'>
          <div className='flex items-center gap-2'>
            <span className='flex items-center gap-1'>
              <StarIcon sx={{ color: '#ffff19' }} />
              <span className='inline-block w-[45px] translate-y-[1px] transform'>
                4.56
              </span>
            </span>
            <span className='text-text/50 inline-block translate-y-[1px] transform'>
              {episode.uploadDate}
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <button className='text-chaintoon cursor-pointer'>NFT 발행</button>
            <Link to={`/myworks/webtoon/episode/${episode.episodeId}/update`}>
              <button className='cursor-pointer'>
                <EditIcon className='text-blue-500' />
              </button>
            </Link>
            <button className='cursor-pointer'>
              <DeleteForeverIcon className='text-red-500' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyEpisodeCard
