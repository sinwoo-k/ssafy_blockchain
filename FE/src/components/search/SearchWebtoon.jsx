import React from 'react'
import SearchWebtoonCard from './SearchWebtoonCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'

const SearchWebtoon = ({ webtoonList }) => {
  return (
    <div className='flex w-[1000px] flex-col gap-3 py-5'>
      <h2 className='text-xl'>웹툰</h2>
      <div className='flex justify-between'>
        <span>총 {webtoonList.length}건</span>
      </div>
      <div>
        {webtoonList.length === 0 ? (
          <div className='flex w-full flex-col items-center justify-center gap-3'>
            <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
            <p className='text-xl'>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className='grid grid-cols-4 gap-y-8'>
            {webtoonList.map((webtoon) => (
              <SearchWebtoonCard
                key={`webtoon-${webtoon.webtoonId}`}
                webtoon={webtoon}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchWebtoon
