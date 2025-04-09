import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import WebtoonDetailInfo from '../../components/webtoon/WebtoonDetailInfo'
import WebtoonDetailEpisodeList from '../../components/webtoon/WebtoonDetailEpisodeList'
import { getWebtoon } from '../../api/webtoonAPI'

const WebtoonDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  const [webtoon, setWebtoon] = useState({})

  const getData = async () => {
    try {
      const result = await getWebtoon(params.webtoonId)
      setWebtoon(result)
    } catch (error) {
      navigate('/error', { state: { message: error.response.data.message } })
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
      <WebtoonDetailInfo webtoon={webtoon} patchData={getData} />
      <WebtoonDetailEpisodeList webtoonId={webtoon.webtoonId} />
    </div>
  )
}

export default WebtoonDetail
