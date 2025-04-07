import React from 'react'
import { Link } from 'react-router-dom'

const RankingWebtoonCard = ({ webtoon, rank }) => {
  return (
    <div className='flex items-center gap-2'>
      <h1 className='text-chaintoon text-2xl'>{rank}</h1>
      <Link
        to={`/webtoon/${webtoon.webtoonId}`}
        className='border-chaintoon rounded-lg border'
      >
        <img
          src={webtoon.seroThumbnail}
          alt={`${webtoon.webtoonName} 세로 썸네일`}
          className='h-[75px] w-[100px] rounded-lg object-cover'
        />
      </Link>
      <div>
        <p className='text-sm'>{webtoon.webtoonName}</p>
        <p className='text-text/75 text-xs'>{webtoon.writer}</p>
      </div>
    </div>
  )
}

export default RankingWebtoonCard
