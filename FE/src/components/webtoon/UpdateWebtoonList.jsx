import React, { useEffect, useState } from 'react'
import { getWebtoonList } from '../../api/webtoonAPI'
import UpdateWebtoonCard from './UpdateWebtoonCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'

const UpdateWebtoonList = () => {
  const [webtoons, setWebtoons] = useState([])
  const getData = async () => {
    try {
      const result = await getWebtoonList()
      setWebtoons(result)
    } catch (error) {
      console.error('웹툰 목록 조회 실패: ', error)
    }
  }

  useEffect(() => {
    getData()
  }, [])
  return (
    <div className='flex h-full w-full justify-center'>
      <div className='flex h-full w-full flex-col'>
        <h2 className='mb-5 text-xl'>🔥 최신 업데이트 웹툰</h2>
        {webtoons.length === 0 ? (
          <div className='flex h-[166px] w-full flex-col items-center justify-center gap-3'>
            <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
            <p className='text-xl'>등록된 웹툰이 없습니다.</p>
          </div>
        ) : (
          <div className='grid grid-cols-3 gap-3'>
            {webtoons.map((webtoon) => (
              <UpdateWebtoonCard key={webtoon.webtoonId} webtoon={webtoon} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UpdateWebtoonList
