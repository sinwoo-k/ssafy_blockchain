import React, { useEffect, useState } from 'react'
import { getDomainSearch } from '../../api/searchAPI'
import Pagination from '../common/Pagination'
import SearchWebtoonCard from './SearchWebtoonCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'

const SearchWebtoon = ({ keyword }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [webtoons, setWebtoons] = useState([])

  const getData = async (page) => {
    try {
      const result = await getDomainSearch(keyword, 'SEARCH_WEBTOON', page)
      setWebtoons(result.searchResult)
      setTotalCount(result.totalCount)
      if (result.totalPage) {
        setTotalPage(result.totalPage)
      } else {
        const pageSize = 10
        setTotalPage(Math.ceil(result.totalCount / pageSize))
      }
    } catch (error) {
      console.error('검색 결과 조회 실패: ', error)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    getData(page)
  }

  useEffect(() => {
    // mount
    getData(1)
    setCurrentPage(1)
    // unmount
    return () => {}
  }, [keyword])

  return (
    <div className='flex w-[1000px] flex-col gap-3 py-5'>
      <h2 className='text-xl'>웹툰</h2>
      <div className='flex justify-between'>
        <span>총 {totalCount}건</span>
      </div>
      <div className='mb-10'>
        {webtoons.length === 0 ? (
          <div className='flex h-[300px] w-full flex-col items-center justify-center gap-3'>
            <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
            <p className='text-xl'>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className='grid grid-cols-4 gap-y-8'>
            {webtoons.map((webtoon) => (
              <SearchWebtoonCard
                key={`webtoon-${webtoon.webtoonId}`}
                webtoon={webtoon}
              />
            ))}
          </div>
        )}
      </div>
      {webtoons.length !== 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default SearchWebtoon
