import React, { useState } from 'react'
import UserProfileInfo from '../../components/user/UserProfileInfo'
import UserProfileWebtoon from '../../components/user/UserProfileWebtoon'
import UserProfileFanart from '../../components/user/UserProfileFanart'

const dummy = {
  userId: 1,
  username: '유저',
  profileImage: null,
  url: null,
  follow: 'N',
  followersCount: 0,
  followingCount: 0,
  createdAt: '20250331',
}

const UserProfile = () => {
  const [userData, setUserData] = useState(dummy)
  const [active, setActive] = useState('webtoon')
  return (
    <div className='py-[60px]'>
      <UserProfileInfo user={userData} setUser={setUserData} />
      <div className='flex justify-center py-5'>
        <div className='flex w-[1000px] border-b'>
          <button
            className={`${active === 'webtoon' && 'bg-chaintoon text-black'}
              w-[150px] cursor-pointer py-2`}
            onClick={() => setActive('webtoon')}
          >
            웹툰
          </button>
          <button
            className={`${active === 'fanart' && 'bg-chaintoon text-black'}
              w-[150px] cursor-pointer py-2`}
            onClick={() => setActive('fanart')}
          >
            팬아트
          </button>
        </div>
      </div>
      {active === 'webtoon' && <UserProfileWebtoon />}
      {active === 'fanart' && <UserProfileFanart />}
    </div>
  )
}

export default UserProfile
