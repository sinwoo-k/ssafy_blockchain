import React from 'react'
import { useParams } from 'react-router-dom'
import FanartWebtoonInfo from '../../components/fanart/FanartWebtoonInfo'
import FanartList from '../../components/fanart/FanartList'

const FanartWebtoon = () => {
  const params = useParams()

  return (
    <div>
      <FanartWebtoonInfo webtoonId={params.webtoonId} />
      <FanartList webtoonId={params.webtoonId} />
    </div>
  )
}

export default FanartWebtoon
