import React, { useState } from 'react';
import ProfileEditModal from './ProfileEdit';
import FollowModal from './FollowModal';
import { userData, followersData, followingData, nftData } from '../../pages/mypage/data';

const UserProfile = () => {
  // 상태 관리
  const [user, setUser] = useState(userData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFields, setEditFields] = useState({
    username: user.username,
    bio: user.bio || '',
    url: user.url || '',
    email: user.email || ''
  });
  
  // 팔로우 모달 관련 상태
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followers, setFollowers] = useState(followersData);
  const [following, setFollowing] = useState(followingData);
  
  // 복사 알림 상태
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  
  // 프로필 이미지 변경
  const handleProfileImageChange = () => {
    console.log('프로필 이미지 변경');
  };

  // URL로 이동하는 함수
  const handleGoToUrl = () => {
    if (user.url && user.url.trim() !== '') {
      let url = user.url;
      // URL에 프로토콜이 없는 경우 https:// 추가
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank');
    } else {
      console.log('설정된 URL이 없습니다.');
    }
  };

  // 주소 복사 함수
  const handleCopyPageAddress = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        console.log('현재 페이지 주소가 클립보드에 복사되었습니다.');
        // 복사 알림 표시
        setShowCopyNotification(true);
        // 2초 후 알림 숨기기
        setTimeout(() => {
          setShowCopyNotification(false);
        }, 2000);
      })
      .catch(err => {
        console.error('주소 복사 실패:', err);
      });
  };
  
  // 정보 수정 모달 열기
  const handleOpenEditModal = () => {
    setEditFields({
      username: user.username,
      bio: user.bio || '',
      url: user.url || '',
      email: user.email || ''
    });
    setShowEditModal(true);
  };
  
  // 정보 수정 모달 필드 변경 처리
  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditFields(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 정보 수정 저장
  const handleSaveEdit = () => {
    // 실제 구현에서는 API 호출하여 사용자 정보 업데이트
    setUser(prev => ({
      ...prev,
      username: editFields.username,
      bio: editFields.bio,
      url: editFields.url,
      email: editFields.email
    }));
    setShowEditModal(false);
  };
  
  // 팔로워/팔로잉 관련 함수
  const handleFollowersClick = () => {
    setShowFollowersModal(true);
  };
  
  const handleFollowingClick = () => {
    setShowFollowingModal(true);
  };
  
  const handleFollow = (userId) => {
    console.log(`팔로우: 사용자 ID ${userId}`);
    // 실제 구현에서는 API 호출하여 팔로우 처리
    
    // 임시 구현: 팔로워에 추가
    const userToFollow = followers.find(f => f.id === userId);
    if (userToFollow) {
      setFollowing(prev => [...prev, userToFollow]);
    }
  };
  
  const handleUnfollow = (userId) => {
    console.log(`언팔로우: 사용자 ID ${userId}`);
    // 실제 구현에서는 API 호출하여 언팔로우 처리
    
    // 임시 구현: 팔로잉에서 제거
    setFollowing(prev => prev.filter(f => f.id !== userId));
  };

  return (
    <>
      <div className="border-b border-gray-800 py-3 mt-10">
        <div className="flex items-start mb-5">
          {/* 프로필 이미지 */}
          <div className="relative mr-4 group mt-1">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-700">
              {user.profileImage ? (
                <img src={user.profileImage} alt="프로필" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-700"></div>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                 onClick={handleProfileImageChange}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          
          {/* 사용자 정보 */}
          <div className="flex-grow">
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-lg font-bold">{user.username}</h1>
              
              <div className="flex items-center space-x-3 ml-2">
                {/* 정보 수정 아이콘 */}
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={handleOpenEditModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                
                {/* URL 링크 아이콘 - 클릭 시 해당 URL로 이동 */}
                <button 
                  className={`text-gray-400 hover:text-white ${!user.url ? 'opacity-50 cursor-not-allowed' : ''}`} 
                  title={user.url ? `${user.url}로 이동` : '설정된 URL이 없습니다'}
                  onClick={handleGoToUrl}
                  disabled={!user.url}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
                
                {/* 페이지 주소 복사 아이콘 */}
                <div className="relative">
              <button 
                  className="text-gray-400 hover:text-white" 
                  onClick={handleCopyPageAddress}
                  title="현재 페이지 주소 복사"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-5 relative top-0.5" fill="none" viewBox="0 0 24 21" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
                
                {/* 복사 알림 */}
                {showCopyNotification && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                    페이지 주소가 복사되었습니다
                  </div>
                )}
                </div>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-1">{user.bio || '안녕하세요'}</p>
            
          </div>
          
          {/* 잔액 정보 */}
          <div className="text-right text-sm mt-3">
            <div className="mb-3">
              <span className="text-xs text-gray-400 mr-2">순자산</span>
              <span>{user.balance.eth} ETH</span>
            </div>
            <div className="mb-1">
              <span className="text-xs text-gray-400 mr-2">USD가치</span>
              <span>$ {user.balance.usd}</span>
            </div>
          </div>
        </div>
        {/* 팔로워/팔로잉 버튼 */}
        <div className="flex space-x-3 mb-1 ml-3">
          <button 
            className="text-[#3cc3ec] hover:underline flex items-center"
            onClick={handleFollowersClick}
          >
            <span>팔로워 {followers.length}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <span className="text-gray-400">|</span>
          <button 
            className="text-[#3cc3ec] hover:underline flex items-center"
            onClick={handleFollowingClick}
          >
            <span>팔로잉 {following.length}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {/* 가입일 */}
        <div className="flex items-center text-xs text-gray-400 mt-4 ml-3">
          <span>{user.registrationDate}</span>
          <span className="mx-2">|</span>
          <span>NFT {nftData.length}개</span>
        </div>
        
      </div>
      
      {/* 프로필 수정 모달 */}
      <ProfileEditModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        editFields={editFields}
        onChange={handleEditFieldChange}
        onSave={handleSaveEdit}
        user={user}
      />
      
      {/* 팔로워 모달 */}
      <FollowModal 
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="팔로워"
        users={followers}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        isFollowingList={false}
      />
      
      {/* 팔로잉 모달 */}
      <FollowModal 
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="팔로잉"
        users={following}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        isFollowingList={true}
      />
    </>
  );
};

export default UserProfile;
