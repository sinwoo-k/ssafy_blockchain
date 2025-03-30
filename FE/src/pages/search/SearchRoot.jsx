import React, { useEffect, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'

const SearchRoot = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    // mount
    setKeyword(searchParams.get('keyword'))
    // unmont
    return () => {}
  }, [])
  return (
    <div className='py-[60px]'>
      <div className='my-10 flex justify-center'>
        <h1 className='mb-5 text-2xl'>
          "<span className='text-chaintoon'>{keyword}</span>"에 대한 결과
        </h1>
      </div>
      <Outlet />
    </div>
  )
}

export default SearchRoot
