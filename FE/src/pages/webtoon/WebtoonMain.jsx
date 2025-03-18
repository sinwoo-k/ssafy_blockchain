import React from 'react'
import TodayRecommend from '../../components/webtoon/TodayRecommend'
import WebtoonList from '../../components/webtoon/WebtoonList'

const WebtoonMain = () => {
  return (
    <div className='relative min-h-screen bg-black'>
      <TodayRecommend />
      <WebtoonList />
    </div>
  )
}

export default WebtoonMain
