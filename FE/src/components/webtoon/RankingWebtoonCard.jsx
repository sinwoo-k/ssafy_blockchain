import React from 'react'
import { Link } from 'react-router-dom'

const RankingWebtoonCard = ({ webtoon, rank }) => {
  return (
    <div className='flex items-center gap-2'>
      <h1 className='text-chaintoon text-2xl'>{rank}</h1>
      <Link
        to={`/webtoon/${webtoon.webtoonId}`}
        className='border-chaintoon overflow-hidden rounded-lg border'
      >
        <img
          src={webtoon.garoThumbnail}
          alt={`${webtoon.webtoonName} 가로 썸네일`}
          className='h-[75px] w-[100px] rounded-lg object-cover
          transition-transform duration-150 ease-in-out hover:scale-105'
        />
      </Link>
      <div className='w-[80px]'>
        <Link>
          <p className='truncate text-sm hover:underline'>
            {webtoon.webtoonName}
          </p>
        </Link>
        <Link to={`/user/${webtoon.userId}`}>
          <p className='text-text/75 truncate text-xs hover:underline'>
            {webtoon.writer}
          </p>
        </Link>
      </div>
    </div>
  )
}

export default RankingWebtoonCard
