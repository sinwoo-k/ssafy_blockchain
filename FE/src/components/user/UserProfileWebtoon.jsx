import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserProfileWebtoonCard from './UserProfileWebtoonCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'
import { getUserWebtoon } from '../../api/webtoonAPI'

const UserProfileWebtoon = ({ userId }) => {
  const navigate = useNavigate()

  const [webtoons, setWebtoons] = useState([])

  const getData = async () => {
    try {
      const result = await getUserWebtoon(userId)
      console.log(result)
      setWebtoons(result)
    } catch (error) {
      console.error('웹툰 조회 실패: ', error)
      navigate('/error', { state: { message: error.response.data.message } })
    }
  }

  useEffect(() => {
    // mount
    if (userId) {
      getData()
    }
    // unmount
    return () => {}
  }, [userId])
  return (
    <div className='flex justify-center'>
      <div className='min-h-[500px] w-[1000px] py-10'>
        {webtoons.length === 0 ? (
          <div className='flex h-full w-full flex-col items-center justify-center gap-3'>
            <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
            <p className='text-xl'>등록된 웹툰이 없습니다.</p>
          </div>
        ) : (
          <div className='grid grid-cols-4 gap-y-8'>
            {webtoons.map((webtoon) => (
              <UserProfileWebtoonCard
                key={`webtoon-${webtoon.webtoonId}`}
                webtoon={webtoon}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfileWebtoon
