import React, { useState } from 'react'
import TodayRecommend from '../../components/webtoon/TodayRecommend'
import WebtoonList from '../../components/webtoon/WebtoonList'
import SingleSearchBar from '../../components/search/SingleSearchBar'
import GenreWebtoonList from '../../components/webtoon/GenreWebtoonList'
import RankingWebtoonList from '../../components/webtoon/RankingWebtoonList'
import UpdateWebtoonList from '../../components/webtoon/UpdateWebtoonList'

const genreList = [
  '판타지',
  '로맨스',
  '액션',
  '일상',
  '스릴러',
  '개그',
  '무협/사극',
  '드라마',
  '감성',
  '스포츠',
]

const WebtoonMain = () => {
  const [genreActive, setGenreActive] = useState(genreList[0])

  return (
    <div className='relative min-h-screen bg-black'>
      <TodayRecommend />
      <div className='relative -top-8 mb-10 flex justify-center'>
        <SingleSearchBar type={'webtoon'} />
      </div>
      <div className='mb-10 flex justify-center'>
        <div className='w-[1000px]'>
          {/* 장르별 웹툰 */}
          <div className='flex gap-3'>
            <h1 className='text-xl'>장르별 인기 웹툰</h1>
            <div className='flex gap-1'>
              {genreList.map((genre, index) => (
                <div key={genre} className='flex items-center gap-1'>
                  <span className='text-text/50 text-2xl'>
                    {index !== 0 && '·'}
                  </span>
                  <span
                    className={`${genreActive === genre ? 'text-chaintoon' : 'text-text/75'}
                  cursor-pointer text-sm`}
                    onClick={() => setGenreActive(genre)}
                  >
                    {genre}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <GenreWebtoonList genre={genreActive} />
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='flex w-[1000px] gap-15'>
          <div className='grow'>
            {/* <WebtoonList /> */}
            <UpdateWebtoonList />
          </div>
          <div className='flex flex-col gap-5 py-5'>
            <RankingWebtoonList type={'view'} />
            <RankingWebtoonList type={'rating'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebtoonMain
