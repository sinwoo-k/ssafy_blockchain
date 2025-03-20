import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// 컴포넌트
import MyWebtoonCard from '../../components/myworks/MyWebtoonCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'

// 디폴트 이미지
import fantasyCover from '../../assets/defaultCover/fantasy.webp'
import actionCover from '../../assets/defaultCover/action.webp'
import romanceCover from '../../assets/defaultCover/romance.webp'
import dramaCover from '../../assets/defaultCover/drama.webp'
import historyCover from '../../assets/defaultCover/history.webp'

const dummyData = [
  {
    id: 0,
    title: '판타지',
    genre: 'fantasy',
    cover: fantasyCover,
    episodeCount: 51,
  },
  {
    id: 1,
    title: '액션',
    genre: 'action',
    cover: actionCover,
    episodeCount: 11,
  },
  {
    id: 2,
    title: '로맨스',
    genre: 'romance',
    cover: romanceCover,
    episodeCount: 230,
  },
  {
    id: 3,
    title: '드라마',
    genre: 'drama',
    cover: dramaCover,
    episodeCount: 1,
  },
  {
    id: 4,
    title: '무협/사극',
    genre: 'history',
    cover: historyCover,
    episodeCount: 10,
  },
]

const MyWebtoon = () => {
  // 내 작품 목록
  const [webtoons, setWebtoons] = useState([])

  useEffect(() => {
    // mount
    setWebtoons(dummyData)
    // unmount
    return () => {}
  }, [])
  return (
    <div className='flex justify-center pt-[60px]'>
      <div className='w-[1000px] py-10'>
        <div className='mb-10 flex items-center gap-3'>
          <h1 className='text-chaintoon text-2xl'>내 웹툰</h1>
          <span className='text-2xl'>|</span>
          <Link className='text-text/75 text-xl'>내 팬아트</Link>
        </div>
        <div className='mb-1 flex items-end justify-between'>
          <p>총 {webtoons.length}개</p>
          <Link className='hover:text-chaintoon'>신규 등록</Link>
        </div>
        <div className='border-text border-t'>
          {webtoons.length === 0 ? (
            <div className='flex h-[300px] w-full flex-col items-center justify-center gap-3'>
              <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
              <p className='text-xl'>등록된 에피소드가 없습니다.</p>
            </div>
          ) : (
            webtoons.map((webtoon) => (
              <Link key={webtoon.id}>
                <MyWebtoonCard webtoon={webtoon} />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default MyWebtoon
