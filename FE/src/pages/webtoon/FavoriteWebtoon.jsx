import React, { useEffect, useState } from 'react'
import { getFavoriteWebtoon } from '../../api/webtoonAPI'
import FavoriteWebtoonCard from '../../components/webtoon/FavoriteWebtoonCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'

const FavoriteWebtoon = () => {
  const [webtoons, setWebtoons] = useState([])
  const getData = async () => {
    try {
      const result = await getFavoriteWebtoon()
      setWebtoons(result)
    } catch (error) {
      console.error('관심 웹툰 조회 실패: ', error)
    }
  }
  useEffect(() => {
    // mount
    getData()
    // unmount
    return () => {}
  }, [])
  return (
    <div className='flex justify-center pt-[60px]'>
      <div className='w-[1000px] py-10'>
        <div className='mb-10 flex items-center gap-3'>
          <h1 className='text-2xl'>내 관심 웹툰</h1>
        </div>
        <div className='mb-3 flex items-end justify-between'>
          <p>총 {webtoons.length}개</p>
        </div>
        <div>
          {webtoons.length === 0 ? (
            <div className='flex h-[300px] w-full flex-col items-center justify-center gap-3'>
              <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
              <p className='text-xl'>관심 웹툰이 없습니다.</p>
            </div>
          ) : (
            <div className='grid grid-cols-4 gap-y-6'>
              {webtoons.map((webtoon) => (
                <FavoriteWebtoonCard
                  key={webtoon.webtoonId}
                  webtoon={webtoon}
                  patchData={getData}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FavoriteWebtoon
