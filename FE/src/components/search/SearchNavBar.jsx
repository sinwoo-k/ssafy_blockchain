import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'

const SearchNavBar = ({ keyword }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const active = searchParams.get('searchType') || 'all'
  const webtoonsCount = useSelector((state) => state.search.webtoons.length)
  const usersCount = useSelector((state) => state.search.users.length)
  const fanartsCount = useSelector((state) => state.search.fanarts.length)
  const goodsCount = useSelector((state) => state.search.goods.length)
  return (
    <div className='flex w-[1000px] border-b'>
      <Link
        to={`/search?keyword=${keyword}`}
        className={`${active === 'all' && 'bg-chaintoon text-black'} w-[150px] py-2 text-center`}
      >
        전체 ({webtoonsCount + usersCount + fanartsCount + goodsCount})
      </Link>
      <Link
        to={`/search?keyword=${keyword}&searchType=webtoon`}
        className={`${active === 'webtoon' && 'bg-chaintoon text-black'} w-[150px] py-2 text-center`}
      >
        웹툰 ({webtoonsCount})
      </Link>
      <Link
        to={`/search?keyword=${keyword}&searchType=user`}
        className={`${active === 'user' && 'bg-chaintoon text-black'} w-[150px] py-2 text-center`}
      >
        유저 ({usersCount})
      </Link>
      <Link
        to={`/search?keyword=${keyword}&searchType=fanart`}
        className={`${active === 'fanart' && 'bg-chaintoon text-black'} w-[150px] py-2 text-center`}
      >
        팬아트 ({fanartsCount})
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
