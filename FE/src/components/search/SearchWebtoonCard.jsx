import React from 'react'
import { Link } from 'react-router-dom'

const SearchWebtoonCard = ({ webtoon }) => {
  return (
    <div className='mx-5'>
      {/* 웹툰 대표이미지 */}
      <div className='border-chaintoon mb-3 w-[200px] rounded-xl border'>
        <Link to={`/webtoon/${webtoon.webtoonId}`}>
          <img
            src={webtoon.seroThumbnail}
            alt={`${webtoon.webtoonName} 대표 이미지`}
            className='h-[250px] w-[200px] rounded-xl'
          />
        </Link>
      </div>
      {/* 웹툰 정보 */}
      <div className='px-2'>
        <h2 className='text-lg'>{webtoon.webtoonName}</h2>
        <p className='text-text/75'>{webtoon.writer}</p>
      </div>
    </div>
  )
}

export default SearchWebtoonCard
