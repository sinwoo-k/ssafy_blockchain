import React, { useState } from 'react'

const MyWebtoon = () => {
  // 내 작품 목록
  const [webtoons, setWebtoons] = useState([])
  return (
    <div className='flex justify-center pt-[60px]'>
      <div className='w-[1000px] py-20'>
        <div className='mb-1 flex items-end justify-between'>
          <h1 className='text-xl'>내 작품 목록</h1>
          <button className='hover:text-chaintoon cursor-pointer'>
            신규 등록
          </button>
        </div>
        <div className='border-text border-t'></div>
      </div>
    </div>
  )
}

export default MyWebtoon
