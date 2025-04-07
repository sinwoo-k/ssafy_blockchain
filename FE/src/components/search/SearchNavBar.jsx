import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'

const SearchNavBar = ({
  keyword,
  webtoonCount,
  userCount,
  fanartCount,
  goodsCount,
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const active = searchParams.get('searchType') || 'all'

  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    // mount
    setTotalCount(webtoonCount + userCount + fanartCount + goodsCount)
    // unmount
    return () => {}
  }, [webtoonCount, userCount, fanartCount, goodsCount])
  return (
    <div className='flex w-[1000px] border-b'>
      <Link
        to={`/search?keyword=${keyword}`}
        className={`${active === 'all' && 'bg-chaintoon text-black'} w-[150px] py-2 text-center`}
      >
        전체 ({totalCount})
      </Link>
      <Link
        to={`/search?keyword=${keyword}&searchType=webtoon`}
        className={`${active === 'webtoon' && 'bg-chaintoon text-black'} w-[150px] py-2 text-center`}
      >
        웹툰 ({webtoonCount})
      </Link>
      <Link
        to={`/search?keyword=${keyword}&searchType=user`}
        className={`${active === 'user' && 'bg-chaintoon text-black'} w-[150px] py-2 text-center`}
      >
        유저 ({userCount})
      </Link>
      <Link
        to={`/search?keyword=${keyword}&searchType=fanart`}
        className={`${active === 'fanart' && 'bg-chaintoon text-black'} w-[150px] py-2 text-center`}
      >
        팬아트 ({fanartCount})
      </Link>
      <Link
        to={`/search?keyword=${keyword}&searchType=goods`}
        className={`${active === 'goods' && 'bg-chaintoon text-black'} w-[150px] py-2 text-center`}
      >
        굿즈 ({goodsCount})
      </Link>
    </div>
  )
}

export default SearchNavBar
