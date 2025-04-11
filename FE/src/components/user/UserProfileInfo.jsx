import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FollowModal from '../mypage/FollowModal'
import userService from '../../api/userApi'

const UserProfileInfo = ({ user, patchData }) => {
  const [isFollowed, setIsFollowed] = useState(false)
  const [nftCount, setNftCount] = useState(0)
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success',
  })

  const [followModal, setFollowModal] = useState({
    isOpen: false,
    title: '',
    users: [],
    isFollowingList: false,
    isLoading: false
  });

  // 알림 표시 함수
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }))
    }, 3000)
  }

  // 팔로우/언팔로우 토글
  const toggleFollow = async () => {
    try {
      if (isFollowed) {
        await userService.unfollowUser(user.id)
        showNotification('언팔로우했습니다.')
      } else {
        await userService.followUser(user.id)
        showNotification('팔로우했습니다.')
      }
      // 상위 컴포넌트에 데이터 업데이트 요청
      patchData()
      // 토글 상태 변경
      setIsFollowed(!isFollowed)
    } catch (error) {
      console.error('팔로우 토글 실패: ', error)
      showNotification('작업을 처리하는 중 오류가 발생했습니다.', 'error')
    }
  }

    // 팔로워 목록 불러오기
    const loadFollowers = async () => {
      try {
        setFollowModal({
          isOpen: true,
          title: '팔로워',
          users: [],
          isFollowingList: false,
          isLoading: true
        })
        
        const followers = await userService.getFollowers(user.id)
        
        console.log('Followers:', followers); // 데이터 구조 확인
    
        setFollowModal(prev => ({
          ...prev,
          users: followers.map(f => ({
            ...f,
            followed: f.followd === 'true' // 이 부분 수정
          })),
          isLoading: false
        }))
      } catch (error) {
        console.error('팔로워 목록 불러오기 실패:', error)
        showNotification('팔로워 목록을 불러오는 중 오류가 발생했습니다.', 'error')
        setFollowModal(prev => ({
          ...prev,
          users: [], // 빈 배열로 초기화
          isLoading: false
        }))
      }
    }
  
    // 팔로잉 목록 불러오기
    const loadFollowings = async () => {
      try {
        setFollowModal({
          isOpen: true,
          title: '팔로잉',
          users: [],
          isFollowingList: true,
          isLoading: true
        })
        
        const followings = await userService.getFollowing(user.id)
        
        console.log('Followings:', followings); // 데이터 구조 확인
    
        setFollowModal(prev => ({
          ...prev,
          users: followings.map(f => ({
            ...f,
            followed: f.followd === 'true' // 이 부분 수정
          })),
          isLoading: false
        }))
      } catch (error) {
        console.error('팔로잉 목록 불러오기 실패:', error)
        showNotification('팔로잉 목록을 불러오는 중 오류가 발생했습니다.', 'error')
        setFollowModal(prev => ({
          ...prev,
          users: [], // 빈 배열로 초기화
          isLoading: false
        }))
      }
    }
  
    // 모달 닫기
    const closeModal = () => {
      setFollowModal(prev => ({
        ...prev,
        isOpen: false
      }))
    }
  
    // 팔로우 처리
    const handleFollow = async (userId) => {
      try {
        await userService.followUser(userId)
        // 목록 새로고침
        if (followModal.isFollowingList) {
          loadFollowings()
        } else {
          loadFollowers()
        }
        // 사용자 정보 갱신
        patchData()
      } catch (error) {
        console.error('팔로우 실패:', error)
        showNotification('팔로우 처리 중 오류가 발생했습니다.', 'error')
      }
    }
  
    // 언팔로우 처리
    const handleUnfollow = async (userId) => {
      try {
        await userService.unfollowUser(userId)
        // 목록 새로고침
        if (followModal.isFollowingList) {
          loadFollowings()
        } else {
          loadFollowers()
        }
        // 사용자 정보 갱신
        patchData()
      } catch (error) {
        console.error('언팔로우 실패:', error)
        showNotification('언팔로우 처리 중 오류가 발생했습니다.', 'error')
      }
    }

  // 초기 마운트 시 설정
  useEffect(() => {
    setIsFollowed(user.hasFollowed === 'Y' ? true : false)
    // NFT 개수가 있으면 설정
    if (user.nftCount !== undefined) {
      setNftCount(user.nftCount)
    }
  }, [user])

  return (
    <div className='relative flex h-[400px] flex-col items-center'>
      {/* 배경 이미지 */}
      <div className='relative h-[250px] w-full overflow-hidden'>
        {user.backgroundImage ? (
          <img
            src={user.backgroundImage}
            alt='배경'
            className='absolute inset-0 z-0 h-[250px] w-full object-cover'
          />
        ) : (
          <div className='absolute inset-0 z-0 bg-gradient-to-r from-gray-700 to-gray-900' />
        )}
      </div>

      {/* 사용자 정보 */}
      <div className='relative -top-10 w-[1000px] py-3'>
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
                      user?.username?.charAt(0).toUpperCase() ||
                      'U'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 사용자 정보 */}
          <div className='flex-grow mt-7'>
            <div className='mb-1 flex items-center space-x-2'>
              <h1 className='text-lg font-bold'>
                {user?.nickname || user?.username || '사용자'}
              </h1>

              {/* URL 링크 아이콘 - UserProfile과 동일하게 유지 */}
              {user.url && (
                <button
                  className='ml-2 text-gray-400 hover:text-white'
                  title={`${user.url}로 이동`}
                  onClick={() => {
                    let targetUrl = user.url
                    if (
                      !targetUrl.startsWith('http://') &&
                      !targetUrl.startsWith('https://')
                    ) {
                      targetUrl = 'https://' + targetUrl
                    }
                    window.open(targetUrl, '_blank')
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
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
              <p className='mb-1 text-xs text-gray-400'>{user.email}</p>
            )}
          </div>
        </div>

        {/* 팔로워/팔로잉 수 및 버튼 */}
       <div className='mb-1 ml-3 flex space-x-3'>
          <button 
            className='text-gray-400 hover:text-white' 
            onClick={loadFollowers}
          >
            팔로워 {user?.follower || 0}
          </button>
          <span className='text-gray-400'>|</span>
          <button 
            className='text-gray-400 hover:text-white' 
            onClick={loadFollowings}
          >
            팔로잉 {user?.following || 0}
          </button>
          <span className='text-gray-400'>|</span>
          <button
            className={`${isFollowed ? 'text-[#ff2525]' : 'text-[#3cc3ec]'} hover:underline`}
            onClick={toggleFollow}
          >
            {isFollowed ? '언팔로우' : '팔로우하기'}
          </button>
        </div>


        {/* 가입일 + NFT 개수 */}
        <div className='mt-4 ml-3 flex items-center text-xs text-gray-400'>
          <span>
            {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : ''}
          </span>
          {/* <span className='mx-2'>|</span> */}
          {/* <span>NFT {nftCount}개</span> */}
        </div>
      </div>

      {/* 알림 메시지 */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 rounded p-4 shadow-lg ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      <FollowModal
        isOpen={followModal.isOpen}
        onClose={closeModal}
        title={followModal.title}
        users={followModal.users}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        isFollowingList={followModal.isFollowingList}
        isLoading={followModal.isLoading}
        userId={user.id}
        onNotify={showNotification}  // 이 부분 추가

      />
    </div>
  )
}

export default UserProfileInfo
