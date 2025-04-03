import React from 'react'
import { Link } from 'react-router-dom'

const UserProfileWebtoonCard = ({ webtoon }) => {
  return (
    <div className='flex justify-center'>
      <div>
        {/* 웹툰 대표이미지 */}
        <div className='border-chaintoon mb-3 w-[200px] rounded-xl border'>
          <Link to={`/webtoon/${webtoon.id}`}>
            <img
              src={webtoon.cover}
              alt={`${webtoon.title} 대표 이미지`}
              className='h-[250px] w-[200px] rounded-xl object-cover'
            />
          </Link>
        </div>
        {/* 웹툰 정보 */}
        <div className='px-2'>
          <h2 className='text-lg'>{webtoon.title}</h2>
        </div>
      </div>
    </div>
  )
}

export default UserProfileWebtoonCard
