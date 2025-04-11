import React from 'react'
import { Link } from 'react-router-dom'
import { formatUploadDate } from '../../utils/formatting'

const UserProfileWebtoonCard = ({ webtoon }) => {
  return (
    <div className='flex justify-center'>
      <div>
        {/* 웹툰 대표이미지 */}
        <div className='mb-3 w-[200px] rounded-xl'>
          <Link to={`/webtoon/${webtoon.webtoonId}`}>
            <img
              src={webtoon.seroThumbnail}
              alt={`${webtoon.webtoonName} 대표 이미지`}
              className='min-h-[250px] w-[200px] rounded-xl object-cover'
            />
          </Link>
        </div>
        {/* 웹툰 정보 */}
        <div className='px-2'>
          <Link to={`/webtoon/${webtoon.webtoonId}`}>
            <p className='truncate text-lg hover:underline'>
              {webtoon.webtoonName}
            </p>
          </Link>
          <span className='text-chaintoon inline-block translate-y-[1px] transform'>
            {webtoon.lastUploadDate !== ''
              ? formatUploadDate(webtoon.lastUploadDate)
              : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

export default UserProfileWebtoonCard
