import React from 'react'
import TodayRecommend from '../../components/webtoon/TodayRecommend'
import WebtoonList from '../../components/webtoon/WebtoonList'
import SingleSearchBar from '../../components/search/SingleSearchBar'

const WebtoonMain = () => {
  return (
    <div className='relative min-h-screen bg-black'>
      <TodayRecommend />
      <div className='relative -top-8 mb-10 flex justify-center'>
        <SingleSearchBar type={'webtoon'} />
      </div>
      <div className='flex'>
        <WebtoonList />
      </div>
    </div>
  )
}

export default WebtoonMain
