<<<<<<< HEAD
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 아이콘
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import IconButton from '../common/IconButton'
import userService from '../../api/userApi'

const UserProfileInfo = ({ user, patchData }) => {
  const navigate = useNavigate()

  const [isFollowed, setIsFollowed] = useState(false)
=======
import React, { useEffect, useState } from 'react';
import userService from '../../api/userApi';

const UserProfileInfo = ({ user, patchData }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [nftCount, setNftCount] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
>>>>>>> develop

  // 알림 표시 함수
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // 팔로우/언팔로우 토글
  const toggleFollow = async () => {
    try {
      if (isFollowed) {
        await userService.unfollowUser(user.id);
        showNotification('언팔로우했습니다.');
      } else {
        await userService.followUser(user.id);
        showNotification('팔로우했습니다.');
      }
      // 상위 컴포넌트에 데이터 업데이트 요청
      patchData();
      // 토글 상태 변경
      setIsFollowed(!isFollowed);
    } catch (error) {
<<<<<<< HEAD
      console.error('팔로우 토글 실패: ', error)
      navigate('/error', { state: { message: error.response.data.message } })
=======
      console.error('팔로우 토글 실패: ', error);
      showNotification('작업을 처리하는 중 오류가 발생했습니다.', 'error');
>>>>>>> develop
    }
  };

  // 초기 마운트 시 설정
  useEffect(() => {
    setIsFollowed(user.hasFollowed === 'Y' ? true : false);
    // NFT 개수가 있으면 설정
    if (user.nftCount !== undefined) {
      setNftCount(user.nftCount);
    }
  }, [user]);

  return (
    <>
      {/* 배경 이미지 */}
      <div className="relative w-full h-48 overflow-hidden">
        {user.backgroundImage ? (
          <img
            src={user.backgroundImage}
            alt="배경"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 z-0" />
        )}
      </div>
      
      {/* 사용자 정보 */}
      <div className='border-b border-gray-800 py-3 relative'>
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
                    {user?.nickname?.charAt(0).toUpperCase() || 
                     user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 사용자 정보 */}
          <div className='flex-grow'>
            <div className='mb-1 flex items-center space-x-2'>
              <h1 className='text-lg font-bold'>
                {user?.nickname || user?.username || '사용자'}
              </h1>
              
              {/* URL 링크 아이콘 - UserProfile과 동일하게 유지 */}
              {user.url && (
                <button
                  className="text-gray-400 hover:text-white ml-2"
                  title={`${user.url}로 이동`}
                  onClick={() => {
                    let targetUrl = user.url;
                    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
                      targetUrl = 'https://' + targetUrl;
                    }
                    window.open(targetUrl, '_blank');
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none" viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* 소개 */}
            <p className='mb-1 text-sm text-gray-400'>
              {user?.bio || user?.introduction || '안녕하세요'}
            </p>
            
            {/* 이메일 - 있으면 표시 */}
            {user.email && (
              <p className="text-gray-400 text-xs mb-1">
                {user.email}
              </p>
            )}
          </div>
        </div>

        {/* 팔로워/팔로잉 수 및 버튼 */}
        <div className="flex space-x-3 mb-1 ml-3">
          <span className="text-gray-400">
            팔로워 {user?.follower || 0}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-400">
            팔로잉 {user?.following || 0}
          </span>
          <span className="text-gray-400">|</span>
          <button
            className={`${isFollowed ? 'text-[#ff2525]' : 'text-[#3cc3ec]'} hover:underline`}
            onClick={toggleFollow}
          >
            {isFollowed ? '언팔로우' : '팔로우하기'}
          </button>
        </div>

        {/* 가입일 + NFT 개수 */}
        <div className="flex items-center text-xs text-gray-400 mt-4 ml-3">
          <span>{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : ''}</span>
          <span className="mx-2">|</span>
          <span>NFT {nftCount}개</span>
        </div>
      </div>

      {/* 알림 메시지 */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded shadow-lg z-50 ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}
        >
          {notification.message}
        </div>
      )}
    </>
  );
};

export default UserProfileInfo;