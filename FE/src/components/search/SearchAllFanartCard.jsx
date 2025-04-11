import React from 'react'
import { Link } from 'react-router-dom'

const SearchAllFanartCard = ({ fanart }) => {
  return (
    <div className='flex justify-center'>
      <div className='flex flex-col gap-3'>
        <div className='relative'>
          <Link to={`/fanart/${fanart?.fanartId}`}>
            <img
              src={fanart?.fanartImage}
              alt={`${fanart?.fanartName} 이미지`}
              className='h-[200px] w-[180px] rounded-lg object-cover'
            />
          </Link>
        </div>

        <div>
          <p className='w-[180px] truncate text-lg'>{fanart?.fanartName}</p>
          <p className='text-text/75 w-[180px] truncate'>웹툰명</p>
        </div>
      </div>
    </div>
  )
}

export default SearchAllFanartCard
