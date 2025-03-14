import React from 'react'

const WebtoonCard = ({ webtoon }) => {
  return (
    <div className='mx-5'>
      {/* 웹툰 대표이미지 */}
      <div className='border-chaintoon mb-3 h-[300px] w-[250px] rounded-xl border'>
        <img
          src={webtoon.cover}
          alt={`${webtoon.title} 대표 이미지`}
          className='h-[300px]  w-[250px] rounded-xl'
        />
      </div>
      {/* 웹툰 정보 */}
      <div className='px-2'>
        <h2 className='text-lg'>{webtoon.title}</h2>
      </div>
    </div>
  )
}

export default WebtoonCard
