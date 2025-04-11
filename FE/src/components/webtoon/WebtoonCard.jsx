import React from 'react'
import { Link } from 'react-router-dom'
import fantasyCover from '../../assets/defaultCover/fantasy.webp'

const WebtoonCard = ({ webtoon }) => {
  return (
    <div className='mx-5 w-[200px]'>
      {/* 웹툰 대표이미지 */}
      <div className='border-chaintoon mb-3 w-full rounded-xl border'>
        <Link to={`/webtoon/${webtoon.webtoonId}`}>
          <img
            src={webtoon.seroThumbnail}
            alt={`${webtoon.webtoonName} 대표 이미지`}
            className='h-[250px] w-[200px] rounded-xl object-cover'
            onError={(event) => (event.target.src = fantasyCover)}
          />
        </Link>
      </div>
      {/* 웹툰 정보 */}
      <div className='w-full px-1'>
        <h2 className='truncate text-lg'>{webtoon.webtoonName}</h2>
        <p className='text-text/75 truncate'>{webtoon.writer}</p>
      </div>
    </div>
  )
}

export default WebtoonCard
