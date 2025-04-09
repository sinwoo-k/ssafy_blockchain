import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 아이콘
import SearchIcon from '@mui/icons-material/Search'

const SingleSearchBar = ({ type }) => {
  const navigate = useNavigate()

  const [keyword, setKeyword] = useState('')

  const goSearchResult = () => {
    if (keyword.length > 0)
      navigate(`/search?keyword=${keyword}&searchType=${type}`)
  }

  return (
    <div
      className='bg-text/30 border-chaintoon flex h-[50px]
      w-[800px] items-center rounded-full border px-6'
    >
      <input
        type='text'
        className='grow focus:outline-none'
        onKeyDown={(event) => {
          if (event.key === 'Enter') goSearchResult()
        }}
        placeholder={`${type === 'webtoon' ? '웹툰을' : ''} ${type === 'fanart' ? '팬아트를' : ''} 검색하세요`}
        value={keyword}
        maxLength={20}
        onChange={(event) => setKeyword(event.target.value)}
      />
      <button
        className='text-chaintoon cursor-pointer'
        onClick={goSearchResult}
      >
        <SearchIcon sx={{ fontSize: 30 }} />
      </button>
    </div>
  )
}

export default SingleSearchBar
