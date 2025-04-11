import React from 'react'
import { Link } from 'react-router-dom'

const GenreWebtoonCard = ({ webtoon }) => {
  return (
    <div className='flex w-[180px] flex-col gap-2'>
      {/* 웹툰 이미지 */}
      <Link
        to={`/webtoon/${webtoon.webtoonId}`}
        className='overflow-hidden rounded-lg'
      >
        <img
          src={webtoon.garoThumbnail}
          alt={`${webtoon.webtoonName} 가로 썸네일`}
          className='min-h-[120px] w-[180px] rounded-lg object-cover
          transition-transform duration-150 ease-in-out hover:scale-105'
        />
      </Link>
      {/* 웹툰 정보 */}
      <div>
        <Link to={`/webtoon/${webtoon.webtoonId}`}>
          <p className='truncate hover:underline'>{webtoon.webtoonName}</p>
        </Link>
        <Link to={`/user/${webtoon.userId}`}>
          <p className='text-text/75 truncate text-sm hover:underline'>
            {webtoon.writer}
          </p>
        </Link>
      </div>
    </div>
  )
}

export default GenreWebtoonCard
