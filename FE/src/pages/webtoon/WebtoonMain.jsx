import React from 'react'
import TodayRecommend from '../../components/webtoon/TodayRecommend'
import WebtoonList from '../../components/webtoon/WebtoonList'

const WebtoonMain = () => {
  return (
    <div className='text-text/85'>
      <TodayRecommend />
      <WebtoonList />
    </div>
  )
}

export default WebtoonMain
