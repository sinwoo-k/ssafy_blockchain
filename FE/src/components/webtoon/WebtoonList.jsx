import React, { useEffect, useState } from 'react'
import WebtoonCard from './WebtoonCard'
// 디폴트 이미지
import fantasyCover from '../../assets/defaultCover/fantasy.webp'
import actionCover from '../../assets/defaultCover/action.webp'
import romanceCover from '../../assets/defaultCover/romance.webp'
import dramaCover from '../../assets/defaultCover/drama.webp'
import historyCover from '../../assets/defaultCover/history.webp'

const WebtoonList = () => {
  // 현재 정렬 상태
  const [active, setActive] = useState('date')
  // 웹툰 리스트
  const [webtoons, setWebtoons] = useState([])

  // 웹툰 정렬
  const sortWebtoons = (keyword) => {
    console.log(keyword)
    setActive(keyword)
  }

  useEffect(() => {
    // mount
    setWebtoons([
      { id: 0, title: '판타지', genre: 'fantasy', cover: fantasyCover },
      { id: 1, title: '액션', genre: 'action', cover: actionCover },
      { id: 2, title: '로맨스', genre: 'romance', cover: romanceCover },
      { id: 3, title: '드라마', genre: 'drama', cover: dramaCover },
      { id: 4, title: '무협/사극', genre: 'history', cover: historyCover },
    ])
    // unmount
    return () => {}
  }, [])
  return (
    <div className='flex justify-center'>
      <div className='flex w-[1160px] flex-col'>
        {/* 정렬 */}
        <div className='mb-5 flex gap-5'>
          <button
            className={`cursor-pointer ${active === 'date' && 'text-chaintoon'}`}
            onClick={() => sortWebtoons('date')}
          >
            최신순
          </button>
          <button
            className={`cursor-pointer ${active === 'view' && 'text-chaintoon'}`}
            onClick={() => sortWebtoons('view')}
          >
            조회순
          </button>
          <button
            className={`cursor-pointer ${active === 'rating' && 'text-chaintoon'}`}
            onClick={() => sortWebtoons('rating')}
          >
            별점순
          </button>
          <button
            className={`cursor-pointer ${active === 'favorite' && 'text-chaintoon'}`}
            onClick={() => sortWebtoons('favorite')}
          >
            관심순
          </button>
        </div>
        {/* 웹툰 리스트 */}
        <div className='mb-24 grid grid-cols-4 gap-y-10'>
          {webtoons.map((webtoon) => (
            <WebtoonCard key={webtoon.id} webtoon={webtoon} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default WebtoonList
