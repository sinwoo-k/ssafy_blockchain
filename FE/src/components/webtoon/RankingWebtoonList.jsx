import React, { useEffect, useState } from 'react'
import { getWebtoonList } from '../../api/webtoonAPI'
import RankingWebtoonCard from './RankingWebtoonCard'

const RankingWebtoonList = ({ type }) => {
  const [webtoons, setWebtoons] = useState([])

  const getViewData = async () => {
    try {
      const result = await getWebtoonList(1, 5, 'view')
      console.log(result)
      setWebtoons(result)
    } catch (error) {
      console.error('뷰어십 웹툰 조회 실패: ', error)
    }
  }

  const getRatingData = async () => {
    try {
      const result = await getWebtoonList(1, 5, 'rating')
      setWebtoons(result)
    } catch (error) {
      console.error('별점 웹툰 조회 실패: ', error)
    }
  }

  useEffect(() => {
    if (type === 'view') getViewData()
    if (type === 'rating') getRatingData()
  }, [type])
  return (
    <div className='py-3'>
      <h1 className='mb-3 border-b pb-2'>
        {type === 'view' ? '조회 수' : '별점'} 랭킹
      </h1>
      <div className='flex flex-col gap-3'>
        {webtoons.map((webtoon, index) => (
          <RankingWebtoonCard
            key={`${type}-${webtoon.webtoonId}`}
            webtoon={webtoon}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  )
}

export default RankingWebtoonList
