import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProfileEditModal from './ProfileEdit';
import FollowModal from './FollowModal';
import userService from '../../api/userApi';
import nftService from '../../api/nftApi';

const UserProfile = () => {
  // 로그인한 사용자 정보 가져오기
  const { user: authUser } = useSelector(state => state.user);
  const userId = authUser?.id;

  // 상태 관리
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);
  const [nftCount, setNftCount] = useState(0);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFields, setEditFields] = useState({
    username: '',
    bio: '',
    url: '',
    email: ''
  });
  
  // 팔로우 모달 관련 상태
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);
  
  // 복사 알림 상태
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  
  // 사용자 정보 로드
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const userData = await userService.getUserInfo(userId);
        setUser(userData);
        
        // 편집 필드 초기화
        setEditFields({
          username: userData.username || '',
          bio: userData.bio || '',
          url: userData.url || '',
          email: userData.email || ''
        });
        
        // 지갑 정보 가져오기
        const wallet = await nftService.getWalletInfo();
        setWalletInfo(wallet);
        
        // NFT 개수 가져오기
        const myNfts = await nftService.getMyNFTs();
        setNftCount(myNfts.length || 0);
        
        setLoading(false);
      } catch (err) {
        console.error('사용자 정보 로드 오류:', err);
        setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);
  
  // 팔로워 목록 가져오기
  const fetchFollowers = async () => {
    if (!userId) return;
    
    try {
      setFollowersLoading(true);
      const followersData = await userService.getFollowers(userId);
      setFollowers(followersData.list || []);
      setFollowersLoading(false);
    } catch (err) {
      console.error('팔로워 목록 로드 오류:', err);
      setFollowersLoading(false);
    }
  };
  
  // 팔로잉 목록 가져오기
  const fetchFollowing = async () => {
    if (!userId) return;
    
    try {
      setFollowingLoading(true);
      const followingData = await userService.getFollowing(userId);
      setFollowing(followingData.list || []);
      setFollowingLoading(false);
    } catch (err) {
      console.error('팔로잉 목록 로드 오류:', err);
      setFollowingLoading(false);
    }
  };
  
  // 프로필 이미지 변경
  const handleProfileImageChange = () => {
    // 이미지 선택 로직 구현 필요
    console.log('프로필 이미지 변경');
    
    // 파일 입력 요소 생성 및 클릭
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // 이미지 업로드 로직 구현 필요
        console.log('선택된 파일:', file);
        
        // FormData로 파일 전송 구현
        const formData = new FormData();
        formData.append('image', file);
        
        // API 호출 구현 필요
      }
    };
    fileInput.click();
  };

  // URL로 이동하는 함수
  const handleGoToUrl = () => {
    if (user?.url && user.url.trim() !== '') {
      let url = user.url;
      // URL에 프로토콜이 없는 경우 https:// 추가
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank');
    }
  };

  // 주소 복사 함수
  const handleCopyPageAddress = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setShowCopyNotification(true);
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
    if (!user) return;
    
    setEditFields({
      username: user.username || '',
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
  const handleSaveEdit = async () => {
    if (!userId) return;
    
    try {
      // API 호출하여 사용자 정보 업데이트
      await userService.updateUserInfo(userId, editFields);
      
      // 업데이트된 정보로 상태 갱신
      setUser(prev => ({
        ...prev,
        ...editFields
      }));
      
      setShowEditModal(false);
    } catch (err) {
      console.error('사용자 정보 업데이트 오류:', err);
      // 에러 처리 로직 추가
    }
  };
  
  // 팔로워/팔로잉 관련 함수
  const handleFollowersClick = () => {
    fetchFollowers();
    setShowFollowersModal(true);
  };
  
  const handleFollowingClick = () => {
    fetchFollowing();
    setShowFollowingModal(true);
  };
  
  const handleFollow = async (userId) => {
    try {
      await userService.followUser(userId);
      // 팔로잉 목록 업데이트
      fetchFollowing();
    } catch (err) {
      console.error('팔로우 오류:', err);
    }
  };
  
  const handleUnfollow = async (userId) => {
    try {
      await userService.unfollowUser(userId);
      // 팔로잉 목록 업데이트
      const updatedFollowing = following.filter(user => user.id !== userId);
      setFollowing(updatedFollowing);
    } catch (err) {
      console.error('언팔로우 오류:', err);
    }
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="border-b border-gray-800 py-3 mt-10">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#3cc3ec]"></div>
        </div>
      </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className="border-b border-gray-800 py-3 mt-10">
        <div className="flex justify-center items-center h-40 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  // 사용자 정보가 없을 때
  if (!user) {
    return (
      <div className="border-b border-gray-800 py-3 mt-10">
        <div className="flex justify-center items-center h-40 text-gray-500">
          사용자 정보를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

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
                <div className="flex h-full w-full items-center justify-center bg-gray-700">
                  <span className="text-white text-lg">{user.username?.charAt(0).toUpperCase()}</span>
                </div>
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
                
                {/* URL 링크 아이콘 */}
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
              <span>{walletInfo?.balance || '0'} ETH</span>
            </div>
            <div className="mb-1">
              <span className="text-xs text-gray-400 mr-2">USD가치</span>
              <span>$ {walletInfo?.usdValue || '0'}</span>
            </div>
          </div>
        </div>
        
        {/* 팔로워/팔로잉 버튼 */}
        <div className="flex space-x-3 mb-1 ml-3">
          <button 
            className="text-[#3cc3ec] hover:underline flex items-center"
            onClick={handleFollowersClick}
          >
            <span>팔로워 {user.followersCount || 0}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <span className="text-gray-400">|</span>
          <button 
            className="text-[#3cc3ec] hover:underline flex items-center"
            onClick={handleFollowingClick}
          >
            <span>팔로잉 {user.followingCount || 0}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {/* 가입일 */}
        <div className="flex items-center text-xs text-gray-400 mt-4 ml-3">
          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          <span className="mx-2">|</span>
          <span>NFT {nftCount}개</span>
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
        isLoading={followersLoading}
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
        isLoading={followingLoading}
      />
    </>
  );
};

export default UserProfile;