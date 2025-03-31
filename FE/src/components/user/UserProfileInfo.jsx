import React from 'react'

// 아이콘
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import IconButton from '../common/IconButton'

const UserProfileInfo = ({ user, setUser }) => {
  const handleFollow = () => {
    setUser((prev) => {
      return { ...prev, followersCount: prev.followersCount + 1, follow: 'Y' }
    })
  }

  const handleUnfollow = () => {
    setUser((prev) => {
      return { ...prev, followersCount: prev.followersCount - 1, follow: 'N' }
    })
  }
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
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 사용자 정보 */}
          <div className='flex-grow'>
            <div className='mb-1 flex items-center space-x-2'>
              <h1 className='text-lg font-bold'>{user?.username}</h1>
            </div>

            <p className='mb-1 text-sm text-gray-400'>
              {user?.bio || '안녕하세요'}
            </p>
          </div>
        </div>
        {/* 팔로워/팔로잉 버튼 */}
        <div className='mb-1 ml-3 flex items-center gap-3'>
          <span>팔로워 {user?.followersCount || 0}</span>
          <span className='text-gray-400'>|</span>
          <span>팔로잉 {user?.followingCount || 0}</span>
          {user?.follow === 'Y' ? (
            <button className={`cursor-pointer`} onClick={handleUnfollow}>
              <IconButton
                Icon={FavoriteIcon}
                tooltip={'언팔로우'}
                style={{ color: '#ff2525' }}
              />
            </button>
          ) : (
            <button className={`cursor-pointer`} onClick={handleFollow}>
              <IconButton
                Icon={FavoriteBorderIcon}
                tooltip={'팔로우하기'}
                style={{ color: '#ff2525' }}
              />
            </button>
          )}
        </div>

        {/* 가입일 */}
        <div className='mt-4 ml-3 flex items-center text-xs text-gray-400'>
          <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

export default UserProfileInfo
