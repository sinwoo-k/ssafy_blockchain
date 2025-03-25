import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import WebtoonDetailInfo from '../../components/webtoon/WebtoonDetailInfo'
import WebtoonDetailEpisodeList from '../../components/webtoon/WebtoonDetailEpisodeList'
import { getWebtoon } from '../../utils/api/webtoonAPI'

const WebtoonDetail = () => {
  const params = useParams()

  const [webtoon, setWebtoon] = useState({})

  const getData = async () => {
    try {
      const data = await getWebtoon(params.webtoonId)
      setWebtoon(data)
    } catch (error) {
      console.error('웹툰 불러오기 실패: ', error)
    }
  }

  useEffect(() => {
    // mount
    getData()
    // unmount
    return () => {}
  }, [])
  return (
    <div>
      <WebtoonDetailInfo webtoon={webtoon} />
      <WebtoonDetailEpisodeList webtoonId={webtoon.webtoonId} />
    </div>
  )
}

export default WebtoonDetail
