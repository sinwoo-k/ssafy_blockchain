import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MyWebtoonDetailInfo from '../../components/myworks/MyWebtoonDetailInfo'
import MyWebtoonDetailEpisodeList from '../../components/myworks/MyWebtoonDetailEpisodeList'
import { getWebtoon } from '../../api/webtoonAPI'

const MyWebtoonDetail = () => {
  const params = useParams()

  return (
    <div className='py-[60px]'>
      <MyWebtoonDetailInfo webtoonId={params.webtoonId} />
      <MyWebtoonDetailEpisodeList webtoonId={params.webtoonId} />
    </div>
  )
}

export default MyWebtoonDetail
