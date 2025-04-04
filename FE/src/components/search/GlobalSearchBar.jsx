import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 아이콘
import SearchIcon from '@mui/icons-material/Search'

const GlobalSearchBar = () => {
  const navigate = useNavigate()

  const [keyword, setKeyword] = useState('')

  const goSearchResult = () => {
    const query = `keyword=${keyword}`
    if (keyword.length > 0) {
      navigate(`/search?${query}`)
      setKeyword('')
    }
  }

  return (
    <div
      className='bg-text/30 flex h-[35px]
    w-[250px] items-center rounded-full border ps-4 pe-2'
    >
      <input
        type='text'
        className='grow focus:outline-none'
        onKeyDown={(event) => {
          if (event.key === 'Enter') goSearchResult()
        }}
        placeholder='통합검색'
        value={keyword}
        maxLength={20}
        onChange={(event) => setKeyword(event.target.value)}
      />
      <button className='cursor-pointer' onClick={goSearchResult}>
        <SearchIcon />
      </button>
    </div>
  )
}

export default GlobalSearchBar
