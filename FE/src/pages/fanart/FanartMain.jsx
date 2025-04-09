import React from 'react'
import NewFanartList from '../../components/fanart/NewFanartList'
import FanartWebtoonList from '../../components/fanart/FanartWebtoonList'
import SingleSearchBar from '../../components/search/SingleSearchBar'

const FanartMain = () => {
  return (
    <div>
      {/* 신규 팬아트 */}
      <NewFanartList />
      <div className='relative -top-6 mb-10 flex justify-center'>
        <SingleSearchBar type={'fanart'} />
      </div>
      {/* 웹툰별 팬아트 보기 */}
      <FanartWebtoonList />
    </div>
  )
}

export default FanartMain
