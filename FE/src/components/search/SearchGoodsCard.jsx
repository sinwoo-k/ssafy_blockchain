import React from 'react'
import { Link } from 'react-router-dom'

const SearchGoodsCard = ({ goods }) => {
  return (
    <div className='flex justify-center'>
      <div className='flex flex-col gap-3'>
        <div className='relative'>
          <Link>
            <img
              src={goods?.goodsImage}
              alt={`${goods?.goodsName} 이미지`}
              className='h-[200px] w-[180px] rounded-lg object-cover'
            />
          </Link>
        </div>

        <div>
          <p className='w-[180px] truncate text-lg'>{goods?.goodsName}</p>
          <p className='text-text/75 w-[180px] truncate'>웹툰명</p>
        </div>
      </div>
    </div>
  )
}

export default SearchGoodsCard
