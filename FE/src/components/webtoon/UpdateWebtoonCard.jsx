import React from 'react'
import { Link } from 'react-router-dom'
import { formatUploadDate } from '../../utils/formatting'

const UpdateWebtoonCard = ({ webtoon }) => {
  return (
    <div className='mx-5 w-[200px]'>
      {/* 웹툰 대표이미지 */}
      <div className='border-chaintoon mb-3 w-full overflow-hidden rounded-xl border'>
        <Link to={`/webtoon/${webtoon.webtoonId}`}>
          <img
            src={webtoon.seroThumbnail}
            alt={`${webtoon.webtoonName} 대표 이미지`}
            className='h-[250px] w-[200px] rounded-xl object-cover
            transition-transform duration-150 ease-in-out hover:scale-105'
          />
        </Link>
      </div>
      {/* 웹툰 정보 */}
      <div className='w-full px-1'>
        <Link to={`/webtoon/${webtoon.webtoonId}`}>
          <h2 className='truncate text-lg hover:underline'>
            {webtoon.webtoonName}
          </h2>
        </Link>
        <Link to={`/user/${webtoon.userId}`}>
          <p className='text-text/75 truncate hover:underline'>
            {webtoon.writer}
          </p>
        </Link>
      </div>
      {/* 업데이트 일자 */}
      <div className='flex items-center justify-between px-1'>
        <div className='text-chaintoon'>
          <span className='inline-block translate-y-[1px] transform'>
            {webtoon.lastUploadDate !== ''
              ? formatUploadDate(webtoon.lastUploadDate)
              : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

export default UpdateWebtoonCard
