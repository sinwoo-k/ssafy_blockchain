import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProfileEditModal from './ProfileEdit';
import FollowModal from './FollowModal';
import userService from '../../api/userApi';
import nftService from '../../api/nftApi';
import { userReducerActions } from '../../redux/reducers/userSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  // 현재 redux에서 userData 가져오기
  const { userData, isAuthenticated } = useSelector(state => state.user);
  
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
    email: '',
    nickname: ''
  });
  
  // 프로필 배경 이미지 관련 상태
  const [showBackgroundImageMenu, setShowBackgroundImageMenu] = useState(false);
  
  // 팔로우 모달 관련 상태
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);
  
  // 알림 상태
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  // 사용자 정보 로드 - 인증 쿠키를 사용하여 현재 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // 1. 먼저 내 정보 가져오기
        let myUserInfo;
        if (!userData) {
          myUserInfo = await userService.getMyUserInfo();
          // 리덕스에 사용자 정보 저장
          dispatch(userReducerActions.setUser(myUserInfo));
        } else {
          myUserInfo = userData;
        }
        
        // 2. 가져온 내 정보의 ID를 사용하여 상세 정보 가져오기
        if (myUserInfo && myUserInfo.id) {
          const userDetails = await userService.getUserInfo(myUserInfo.id);
          setUser(userDetails);
          
          // 편집 필드 초기화
          setEditFields({
            username: userDetails.username || '',
            bio: userDetails.bio || userDetails.introduction || '',
            url: userDetails.url || '',
            email: userDetails.email || '',
            nickname: userDetails.nickname || ''
          });
          
          // 지갑 정보 가져오기 (있을 경우)
          try {
            const wallet = await nftService.getWalletInfo();
            setWalletInfo(wallet);
          } catch (walletErr) {
            console.error('지갑 정보 로드 오류:', walletErr);
            // 지갑 정보가 없어도 계속 진행
          }
          
          // NFT 개수 가져오기 (있을 경우)
          try {
            const myNfts = await nftService.getMyNFTs();
            setNftCount(myNfts.length || 0);
          } catch (nftErr) {
            console.error('NFT 정보 로드 오류:', nftErr);
            // NFT 정보가 없어도 계속 진행
          }
        } else {
          setError('사용자 정보를 찾을 수 없습니다.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('사용자 정보 로드 오류:', err);
        setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [dispatch, isAuthenticated, userData]);
  
  // 팔로워 목록 가져오기
  const fetchFollowers = async () => {
    if (!user || !user.id) return;
    
    try {
      setFollowersLoading(true);
      const followersData = await userService.getFollowers(user.id);
      setFollowers(followersData.list || []);
      setFollowersLoading(false);
    } catch (err) {
      console.error('팔로워 목록 로드 오류:', err);
      setFollowersLoading(false);
    }
  };
  
  // 팔로잉 목록 가져오기
  const fetchFollowing = async () => {
    if (!user || !user.id) return;
    
    try {
      setFollowingLoading(true);
      const followingData = await userService.getFollowing(user.id);
      setFollowing(followingData.list || []);
      setFollowingLoading(false);
    } catch (err) {
      console.error('팔로잉 목록 로드 오류:', err);
      setFollowingLoading(false);
    }
  };
  
  // 알림 표시 함수
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };
  
  // 프로필 이미지 변경
  const handleProfileImageChange = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('image', file);
          
          // API 호출하여 이미지 업로드
          const response = await userService.uploadProfileImage(formData);
          
          // 성공 시 사용자 정보 업데이트
          setUser(prev => ({
            ...prev,
            profileImage: response.profileImage
          }));
          
          // 리덕스 상태도 업데이트
          if (userData) {
            dispatch(userReducerActions.setUser({
              ...userData,
              profileImage: response.profileImage
            }));
          }
          
          showNotification('프로필 이미지가 업데이트되었습니다.');
        } catch (err) {
          console.error('프로필 이미지 업로드 오류:', err);
          showNotification('프로필 이미지 업로드에 실패했습니다.', 'error');
        }
      }
    };
    fileInput.click();
  };
  
  // 프로필 이미지 제거
  const handleDeleteProfileImage = async () => {
    try {
      await userService.deleteProfileImage();
      
      // 성공 시 사용자 정보 업데이트
      setUser(prev => ({
        ...prev,
        profileImage: null
      }));
      
      // 리덕스 상태도 업데이트
      if (userData) {
        dispatch(userReducerActions.setUser({
          ...userData,
          profileImage: null
        }));
      }
      
      showNotification('프로필 이미지가 제거되었습니다.');
    } catch (err) {
      console.error('프로필 이미지 제거 오류:', err);
      showNotification('프로필 이미지 제거에 실패했습니다.', 'error');
    }
  };
  
  // 배경 이미지 변경
  const handleBackgroundImageChange = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('image', file);
          
          // API 호출하여 배경 이미지 업로드
          const response = await userService.uploadBackgroundImage(formData);
          
          // 성공 시 사용자 정보 업데이트
          setUser(prev => ({
            ...prev,
            backgroundImage: response.backgroundImage
          }));
          
          // 리덕스 상태도 업데이트
          if (userData) {
            dispatch(userReducerActions.setUser({
              ...userData,
              backgroundImage: response.backgroundImage
            }));
          }
          
          showNotification('배경 이미지가 업데이트되었습니다.');
        } catch (err) {
          console.error('배경 이미지 업로드 오류:', err);
          showNotification('배경 이미지 업로드에 실패했습니다.', 'error');
        }
      }
    };
    fileInput.click();
  };
  
  // 배경 이미지 제거
  const handleDeleteBackgroundImage = async () => {
    try {
      await userService.deleteBackgroundImage();
      
      // 성공 시 사용자 정보 업데이트
      setUser(prev => ({
        ...prev,
        backgroundImage: null
      }));
      
      // 리덕스 상태도 업데이트
      if (userData) {
        dispatch(userReducerActions.setUser({
          ...userData,
          backgroundImage: null
        }));
      }
      
      showNotification('배경 이미지가 제거되었습니다.');
    } catch (err) {
      console.error('배경 이미지 제거 오류:', err);
      showNotification('배경 이미지 제거에 실패했습니다.', 'error');
    }
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
        showNotification('페이지 주소가 복사되었습니다.');
      })
      .catch(err => {
        console.error('주소 복사 실패:', err);
        showNotification('주소 복사에 실패했습니다.', 'error');
      });
  };
  
  // 정보 수정 모달 열기
  const handleOpenEditModal = () => {
    if (!user) return;
    
    setEditFields({
      username: user.username || '',
      bio: user.bio || user.introduction || '',
      url: user.url || '',
      email: user.email || '',
      nickname: user.nickname || ''
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
  
  // 닉네임 중복 체크
  const checkNickname = async (nickname) => {
    if (!nickname || nickname.trim() === '') return false;
    
    try {
      const result = await userService.checkNicknameExists(nickname);
      return result.exists;
    } catch (err) {
      console.error('닉네임 중복 체크 오류:', err);
      return false;
    }
  };
  
  // 정보 수정 저장
const handleSaveEdit = async () => {
  if (!user) return;
  
  try {
    // 서버에서 기대하는 형식으로 데이터 구조화
    const updateData = {
      nickname: editFields.nickname,
      introduction: editFields.bio // 필드명 확인 필요
    };
    
    if (editFields.url) {
      updateData.url = editFields.url;
    }
    
    console.log('회원 정보 수정 요청 데이터:', updateData);
    
    // API 호출하여 사용자 정보 업데이트 (userId 제거)
    const updatedUser = await userService.updateUserInfo(null, updateData);
    
    // 업데이트된 정보로 상태 갱신
    setUser(prev => ({
      ...prev,
      ...updatedUser
    }));
    
    // 리덕스 상태도 업데이트
    if (userData) {
      dispatch(userReducerActions.setUser({
        ...userData,
        ...updatedUser
      }));
    }
    
    setShowEditModal(false);
    showNotification('회원 정보가 업데이트되었습니다.');
  } catch (err) {
    console.error('사용자 정보 업데이트 오류:', err);
    showNotification('회원 정보 업데이트에 실패했습니다.', 'error');
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
      // 현재 사용자 정보도 갱신 (팔로잉 카운트 업데이트)
      if (user && user.id) {
        const updatedUser = await userService.getUserInfo(user.id);
        setUser(updatedUser);
      }
      showNotification('팔로우했습니다.');
    } catch (err) {
      console.error('팔로우 오류:', err);
      showNotification('팔로우에 실패했습니다.', 'error');
    }
  };
  
  const handleUnfollow = async (userId) => {
    try {
      await userService.unfollowUser(userId);
      // 팔로잉 목록 업데이트
      const updatedFollowing = following.filter(user => user.id !== userId);
      setFollowing(updatedFollowing);
      // 현재 사용자 정보도 갱신 (팔로잉 카운트 업데이트)
      if (user && user.id) {
        const updatedUser = await userService.getUserInfo(user.id);
        setUser(updatedUser);
      }
      showNotification('언팔로우했습니다.');
    } catch (err) {
      console.error('언팔로우 오류:', err);
      showNotification('언팔로우에 실패했습니다.', 'error');
    }
  };

  // 비인증 상태 처리
  if (!isAuthenticated) {
    return (
      <div className="border-b border-gray-800 py-3 mt-10">
        <div className="flex justify-center items-center h-40 text-gray-500">
          로그인이 필요합니다.
        </div>
      </div>
    );
  }

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
      {/* 배경 이미지 */}
      <div className="relative w-full h-48 bg-gray-800 overflow-hidden">
        {user.backgroundImage ? (
          <img 
            src={user.backgroundImage} 
            alt="배경" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-900"></div>
        )}
        
        {/* 배경 이미지 메뉴 */}
        <div className="absolute bottom-2 right-2">
          <button 
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            onClick={() => setShowBackgroundImageMenu(!showBackgroundImageMenu)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
          
          {showBackgroundImageMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded shadow-lg overflow-hidden">
              <button 
                className="block w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                onClick={handleBackgroundImageChange}
              >
                이미지 업로드
              </button>
              <button 
                className="block w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                onClick={handleDeleteBackgroundImage}
                disabled={!user.backgroundImage}
              >
                이미지 제거
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-b border-gray-800 py-3 relative">
        <div className="flex items-start mb-5">
          {/* 프로필 이미지 */}
          <div className="relative mr-4 group mt-1">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-700">
              {user.profileImage ? (
                <img src={user.profileImage} alt="프로필" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-700">
                  <span className="text-white text-lg">{user.nickname?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}</span>
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
            
            {/* 프로필 이미지 제거 */}
            {user.profileImage && (
              <button 
                className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                onClick={handleDeleteProfileImage}
                title="프로필 이미지 제거"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* 사용자 정보 */}
          <div className="flex-grow">
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-lg font-bold">{user.nickname || user.username || '사용자'}</h1>
              
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
                </div>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-1">{user.bio || user.introduction || '안녕하세요'}</p>
            {user.email && (
              <p className="text-gray-400 text-xs mb-1">{user.email}</p>
            )}
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
            <span>팔로워 {user.follower || 0}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <span className="text-gray-400">|</span>
          <button 
            className="text-[#3cc3ec] hover:underline flex items-center"
            onClick={handleFollowingClick}
          >
            <span>팔로잉 {user.following || 0}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {/* 가입일 */}
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
      
      {/* 프로필 수정 모달 */}
      <ProfileEditModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        editFields={editFields}
        onChange={handleEditFieldChange}
        onSave={handleSaveEdit}
        onCheckNickname={checkNickname}
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