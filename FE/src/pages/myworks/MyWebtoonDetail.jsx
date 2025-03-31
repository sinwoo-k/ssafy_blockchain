import React from 'react'
import { useParams } from 'react-router-dom'
import MyWebtoonDetailInfo from '../../components/myworks/MyWebtoonDetailInfo'
import MyWebtoonDetailEpisodeList from '../../components/myworks/MyWebtoonDetailEpisodeList'

const MyWebtoonDetail = () => {
  const params = useParams()
  return (
    <div className='py-[60px]'>
      <MyWebtoonDetailInfo webtoonId={params.webtoonId} />
      <MyWebtoonDetailEpisodeList />
    </div>
  )
}

export default MyWebtoonDetail
