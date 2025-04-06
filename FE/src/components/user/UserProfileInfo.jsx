import React, { useEffect, useState } from 'react'

// 아이콘
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import IconButton from '../common/IconButton'
import userService from '../../api/userApi'

const UserProfileInfo = ({ user, patchData }) => {
  const [isFollowed, setIsFollowed] = useState(false)

  const toggleFollow = async () => {
    try {
      if (isFollowed) {
        const result = await userService.unfollowUser(user.id)
      } else {
        const result = await userService.followUser(user.id)
      }
      patchData()
    } catch (error) {
      console.error('팔로우 토글 실패: ', error)
    }
  }
  useEffect(() => {
    // mount
    setIsFollowed(user.hasFollowed === 'Y' ? true : false)
  }, [user])
  return (
    <div className='mt-10 flex justify-center py-3'>
      <div className='w-[1000px]'>
        <div className='mb-5 flex items-start'>
          {/* 프로필 이미지 */}
          <div className='group relative mt-1 mr-4'>
            <div className='h-16 w-16 overflow-hidden rounded-full bg-gray-700'>
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt='프로필'
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center bg-gray-700'>
                  <span className='text-lg text-white'>
                    {user?.nickname?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 사용자 정보 */}
          <div className='flex-grow'>
            <div className='mb-1 flex items-center space-x-2'>
              <h1 className='text-lg font-bold'>{user?.nickname}</h1>
            </div>

            <p className='mb-1 text-gray-400'>
              {user?.introduction || '안녕하세요'}
            </p>
          </div>
        </div>
        {/* 팔로워/팔로잉 버튼 */}
        <div className='mb-1 ml-3 flex items-center gap-3'>
          <span>팔로워 {user?.follower || 0}</span>
          <span className='text-gray-400'>|</span>
          <span>팔로잉 {user?.following || 0}</span>
          <button className={`cursor-pointer`} onClick={toggleFollow}>
            {isFollowed ? (
              <IconButton
                Icon={FavoriteIcon}
                tooltip={'언팔로우'}
                style={{ color: '#ff2525' }}
              />
            ) : (
              <IconButton
                Icon={FavoriteBorderIcon}
                tooltip={'팔로우하기'}
                style={{ color: '#ff2525' }}
              />
            )}
          </button>
        </div>

        {/* 가입일 */}
        <div className='mt-4 ml-3 flex items-center text-gray-400'>
          <span>{user?.joinDate}</span>
        </div>
      </div>
    </div>
  )
}

export default UserProfileInfo
