import React, { useEffect, useState } from 'react'
import UserProfileWebtoonCard from './UserProfileWebtoonCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'

const webtoonDummy = Array(5)
  .fill()
  .map((_, i) => {
    return {
      webtoonId: i + 1,
      title: `웹툰 ${i + 1}`,
      writer: `작가 ${i + 1}`,
      cover: `https://placehold.co/200x250?text=Webtoon+${i + 1}`,
    }
  })

const UserProfileWebtoon = ({ userId }) => {
  const [webtoons, setWebtoons] = useState([])

  useEffect(() => {
    // mount
    setWebtoons(webtoonDummy)
    // unmount
    return () => {}
  }, [])
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
