import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchNavBar from '../../components/search/SearchNavBar'
import SearchAll from '../../components/search/SearchAll'
import SearchWebtoon from '../../components/search/SearchWebtoon'
import SearchUser from '../../components/search/SearchUser'
import SearchFanart from '../../components/search/SearchFanart'
import SearchGoods from '../../components/search/SearchGoods'
import { getAllSearch } from '../../api/searchAPI'

const SearchRoot = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword')
  const searchType = searchParams.get('searchType') || 'all'

  const [webtoon, setWebtoon] = useState({})
  const [user, setUser] = useState({})
  const [fanart, setFanart] = useState({})
  const [goods, setGoods] = useState({})

  const getData = async () => {
    try {
      const result = await getAllSearch(keyword)
      setWebtoon(result.WEBTOON)
      setUser(result.USER)
      setFanart(result.FANART)
      setGoods(result.GOODS)
    } catch (error) {
      console.error('통합 검색 조회 실패: ', error)
    }
  }

  useEffect(() => {
    // mount
    getData()
    // unmont
    return () => {}
  }, [keyword, searchType])

  return (
    <div className='py-[60px]'>
      <div className='flex flex-col items-center'>
        <div className='my-10 flex justify-center'>
          <h1 className='mb-5 text-2xl'>
            "<span className='text-chaintoon'>{keyword}</span>"에 대한 결과
          </h1>
        </div>
        <SearchNavBar
          keyword={keyword}
          webtoonCount={webtoon.totalCount}
          userCount={user.totalCount}
          fanartCount={fanart.totalCount}
          goodsCount={goods.totalCount}
        />
        {searchType === 'all' && (
          <SearchAll
            keyword={keyword}
            webtoon={webtoon}
            user={user}
            fanart={fanart}
            goods={goods}
          />
        )}
        {searchType === 'webtoon' && <SearchWebtoon keyword={keyword} />}
        {searchType === 'user' && <SearchUser keyword={keyword} />}
        {searchType === 'fanart' && <SearchFanart keyword={keyword} />}
        {searchType === 'goods' && <SearchGoods keyword={keyword} />}
      </div>
    </div>
  )
}

export default SearchRoot
