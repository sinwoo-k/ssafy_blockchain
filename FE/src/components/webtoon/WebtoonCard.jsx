import React from 'react'
import { Link } from 'react-router-dom'
import fantasyCover from '../../assets/defaultCover/fantasy.webp'

const WebtoonCard = ({ webtoon }) => {
  return (
    <div className='mx-5'>
      {/* 웹툰 대표이미지 */}
      <div className='border-chaintoon mb-3 w-[200px] rounded-xl border'>
        <Link to={`/webtoon/${webtoon.webtoonId}`}>
          <img
            src={webtoon.seroThumbnail}
            alt={`${webtoon.webtoonName} 대표 이미지`}
            className='h-[250px] w-[200px] rounded-xl'
            onError={(event) => (event.target.src = fantasyCover)}
          />
        </Link>
      </div>
      {/* 웹툰 정보 */}
      <div className='px-2'>
        <h2 className='text-lg'>{webtoon.webtoonName}</h2>
      </div>
    </div>
  )
}

export default WebtoonCard
