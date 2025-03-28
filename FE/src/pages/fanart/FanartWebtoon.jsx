import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import FanartWebtoonInfo from '../../components/fanart/FanartWebtoonInfo'
import FanartList from '../../components/fanart/FanartList'

const dummy = Array(45)
  .fill()
  .map((_, i) => {
    // 100 ~ 400 사이의 랜덤 크기를 예시로 만듭니다.
    const randomWidth = Math.floor(Math.random() * 101) + 200 // 200~300
    const randomHeight = Math.floor(Math.random() * 201) + 200 // 200~400
    return {
      fanartId: i + 1,
      fanartName: `팬아트 ${i + 1}`,
      fanartImage: `https://placehold.co/${randomWidth}x${randomHeight}?text=Fanart+${i + 1}`,
    }
  })

const FanartWebtoon = () => {
  const params = useParams()

  const [fanarts, setFanarts] = useState(dummy)

  return (
    <div>
      <FanartWebtoonInfo />
      <FanartList fanarts={fanarts} />
    </div>
  )
}

export default FanartWebtoon
