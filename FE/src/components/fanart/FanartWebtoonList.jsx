import React, { useEffect, useState } from 'react'
import FanartWebtoonCard from './FanartWebtoonCard'
import { getAdaptableWebtoonList } from '../../api/webtoonAPI'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'
import { useNavigate } from 'react-router-dom'

const FanartWebtoonList = () => {
  const navigate = useNavigate()

  const [webtoons, setWebtoons] = useState([]) // 웹툰 리스트

  const getData = async (page) => {
    try {
      const data = await getAdaptableWebtoonList(page)
      setWebtoons((prev) => [...prev, ...data])
    } catch (error) {
      navigate('/error', { state: { message: error.response.data.message } })
      console.error(`웹툰 목록 불러오기 실패: `, error)
    }
  }
  useEffect(() => {
    // mount
    getData(1)
    // unmont
    return () => {}
  }, [])

  return (
    <div className='flex h-full w-full justify-center'>
      <div className='flex h-full w-[1000px] flex-col'>
        <h2 className='mb-5 text-xl'>
          🌟 최신 웹툰 업데이트! 팬아트도 즐겨봐요!
        </h2>
        {webtoons.length === 0 ? (
          <div className='flex h-[166px] w-full flex-col items-center justify-center gap-3'>
            <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
            <p className='text-xl'>등록된 웹툰이 없습니다.</p>
          </div>
        ) : (
          <div className='grid grid-cols-4 gap-3 gap-y-7'>
            {webtoons.map((webtoon) => (
              <FanartWebtoonCard
                key={`fanart-${webtoon.webtoonId}`}
                webtoon={webtoon}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FanartWebtoonList
