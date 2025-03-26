import React from 'react'
import NewFanartList from '../../components/fanart/NewFanartList'
import FanartWebtoonList from '../../components/fanart/FanartWebtoonList'

const FanartMain = () => {
  return (
    <div className='mt-[60px]'>
      {/* 신규 팬아트 */}
      <NewFanartList />
      {/* 웹툰별 팬아트 보기 */}
      <FanartWebtoonList />
    </div>
  )
}

export default FanartMain
