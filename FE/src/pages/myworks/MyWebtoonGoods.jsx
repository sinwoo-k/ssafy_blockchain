import React from 'react'
import MyWebtoonGoodsWebtoonInfo from '../../components/myworks/MyWebtoonGoodsWebtoonInfo'
import MyWebtoonGoodsList from '../../components/myworks/MyWebtoonGoodsList'
import { useParams } from 'react-router-dom'

const MyWebtoonGoods = () => {
  const params = useParams()

  return (
    <div className=''>
      <MyWebtoonGoodsWebtoonInfo webtoonId={params.webtoonId} />
      <MyWebtoonGoodsList webtoonId={params.webtoonId} />
    </div>
  )
}

export default MyWebtoonGoods
