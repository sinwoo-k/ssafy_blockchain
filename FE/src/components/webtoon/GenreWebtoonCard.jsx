import React from 'react'
import { Link } from 'react-router-dom'

const GenreWebtoonCard = ({ webtoon }) => {
  return (
    <div className='flex w-[180px] flex-col gap-2'>
      {/* 웹툰 이미지 */}
      <Link
        to={`/webtoon/${webtoon.webtoonId}`}
        className='border-chaintoon rounded-lg border'
      >
        <img
          src={webtoon.garoThumbnail}
          alt={`${webtoon.webtoonName} 가로 썸네일`}
          className='h-[120px] w-[180px] rounded-lg object-cover'
        />
      </Link>
      {/* 웹툰 정보 */}
      <div>
        <p className='truncate'>{webtoon.webtoonName}</p>
        <p className='text-text/75 truncate text-sm'>{webtoon.writer}</p>
      </div>
    </div>
  )
}

export default GenreWebtoonCard
