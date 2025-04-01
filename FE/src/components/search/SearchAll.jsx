import React from 'react'
import { Link } from 'react-router-dom'
import SearchWebtoonCard from './SearchWebtoonCard'
import SearchUserCard from './SearchUserCard'
import SearchAllFanartCard from './SearchAllFanartCard'
import SearchGoodsCard from './SearchGoodsCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'

const SearchAll = ({
  keyword,
  webtoonList,
  userList,
  fanartList,
  goodsList,
}) => {
  return (
    <div className='flex flex-col items-center gap-15 py-5'>
      {/* 웹툰 */}
      <div className='flex w-[1000px] flex-col gap-3'>
        <h2 className='text-xl'>웹툰</h2>
        <div className='flex justify-between'>
          <span>총 {webtoonList.length}건</span>
          <Link to={`/search?keyword=${keyword}&searchType=webtoon`}>
            더보기
          </Link>
        </div>
        <div>
          {webtoonList.length === 0 ? (
            <div className='flex w-full flex-col items-center justify-center gap-3'>
              <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
              <p className='text-xl'>검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className='flex gap-4'>
              {webtoonList.slice(0, 4).map((webtoon) => (
                <SearchWebtoonCard
                  key={`webtoon-${webtoon.webtoonId}`}
                  webtoon={webtoon}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* 유저 */}
      <div className='flex w-[1000px] flex-col gap-3'>
        <h2 className='text-xl'>유저</h2>
        <div className='flex justify-between'>
          <span>총 {userList.length}건</span>
          <Link to={`/search?keyword=${keyword}&searchType=user`}>더보기</Link>
        </div>
        <div>
          {userList.length === 0 ? (
            <div className='flex w-full flex-col items-center justify-center gap-3'>
              <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
              <p className='text-xl'>검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className='flex gap-5'>
              {userList.slice(0, 6).map((user) => (
                <SearchUserCard key={`user-${user.userId}`} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* 팬아트 */}
      <div className='flex w-[1000px] flex-col gap-3'>
        <h2 className='text-xl'>팬아트</h2>
        <div className='flex justify-between'>
          <span>총 {fanartList.length}건</span>
          <Link to={`/search?keyword=${keyword}&searchType=fanart`}>
            더보기
          </Link>
        </div>
        <div>
          {fanartList.length === 0 ? (
            <div className='flex w-full flex-col items-center justify-center gap-3'>
              <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
              <p className='text-xl'>검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className='grid grid-cols-5'>
              {fanartList.slice(0, 5).map((fanart) => (
                <SearchAllFanartCard
                  key={`fanart-${fanart.fanartId}`}
                  fanart={fanart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* 굿즈 */}
      <div className='flex w-[1000px] flex-col gap-3'>
        <h2 className='text-xl'>굿즈</h2>
        <div className='flex justify-between'>
          <span>총 {goodsList.length}건</span>
          <Link to={`/search?keyword=${keyword}&searchType=goods`}>더보기</Link>
        </div>
        <div>
          {goodsList.length === 0 ? (
            <div className='flex w-full flex-col items-center justify-center gap-3'>
              <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
              <p className='text-xl'>검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className='grid grid-cols-5'>
              {goodsList.map((goods) => (
                <SearchGoodsCard key={`goods-${goods.goodsId}`} goods={goods} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchAll
