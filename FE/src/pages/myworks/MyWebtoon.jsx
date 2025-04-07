import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyWebtoon } from '../../api/webtoonAPI'

// 컴포넌트
import MyWebtoonCard from '../../components/myworks/MyWebtoonCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'
import AddIcon from '@mui/icons-material/Add'

const MyWebtoon = () => {
  const navigate = useNavigate()

  // 내 작품 목록
  const [webtoons, setWebtoons] = useState([])

  const getData = async (page = 1, pageSize = 10) => {
    try {
      const data = await getMyWebtoon(page, pageSize)
      setWebtoons(data)
    } catch (error) {
      navigate('/error', { state: { message: error.response.data.message } })
      console.error('내 웹툰 불러오기 실패: ', error)
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
          <h1 className='text-chaintoon text-2xl'>내 웹툰</h1>
          <span className='text-2xl'>|</span>
          <Link to={'/myworks/fanart'} className='text-text/75 text-xl'>
            내 팬아트
          </Link>
        </div>
        <div className='mb-1 flex items-end justify-between'>
          <p>총 {webtoons.length}개</p>
          <Link to={'/myworks/webtoon/create'} className='hover:text-chaintoon'>
            <AddIcon />
            신규 등록
          </Link>
        </div>
        <div className='border-text border-t'>
          {webtoons.length === 0 ? (
            <div className='flex h-[300px] w-full flex-col items-center justify-center gap-3'>
              <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
              <p className='text-xl'>등록된 웹툰이 없습니다.</p>
            </div>
          ) : (
            webtoons.map((webtoon) => (
              <Link
                key={webtoon.webtoonId}
                to={`/myworks/webtoon/${webtoon.webtoonId}`}
              >
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
