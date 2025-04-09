import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProfileEditModal from './ProfileEdit';
import FollowModal from './FollowModal';
import userService from '../../api/userApi';
import nftService from '../../api/nftApi';
import { userReducerActions } from '../../redux/reducers/userSlice';
import WalletInfo from './WalletInfo'

// WalletInfo 컴포넌트는 별도 파일로 분리됨

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userData, isAuthenticated } = useSelector(state => state.user);

  // 로컬 상태
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nftCount, setNftCount] = useState(0);

  // 프로필 수정 모달
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFields, setEditFields] = useState({
    username: '',
    bio: '',
    url: '',
    email: '',
    nickname: ''
  });

  // 배경 이미지 메뉴
  const [showBackgroundImageMenu, setShowBackgroundImageMenu] = useState(false);

  // 팔로워/팔로잉 모달 상태
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);

  // 알림
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // 사용자 정보 로딩
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        let myUserInfo = userData;
        if (!myUserInfo) {
          myUserInfo = await userService.getMyUserInfo();
          dispatch(userReducerActions.setUser(myUserInfo));
        }

        if (myUserInfo?.id) {
          const userDetails = await userService.getUserInfo(myUserInfo.id);
          setUser(userDetails);
          
          // NFT 개수 가져오기
          try {
            const nftList = await nftService.getMyNFTs();
            setNftCount(nftList?.length || 0);
          } catch (nftErr) {
            console.error('NFT 정보 로드 오류:', nftErr);
          }
        } else {
          setError('사용자 정보를 찾을 수 없습니다.');
        }
        setLoading(false);
      } catch (err) {
        console.error('사용자 정보 로딩 오류:', err);
        setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };
    fetchUserData();
  }, [dispatch, userData]);

  // 알림 함수
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };


  // 배경 이미지 업로드
  const handleBackgroundImageChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('backgroundImage', file);
        try {
          await userService.uploadBackgroundImage(formData);
          const updatedUser = await userService.getMyUserInfo();
          setUser(updatedUser);
          dispatch(userReducerActions.setUser(updatedUser));
          showNotification('배경 이미지가 업로드되었습니다.');
        } catch (err) {
          console.error('업로드 에러:', err);
          showNotification('배경 이미지 업로드 실패', 'error');
        }
      }
    };
    input.click();
  };
  
  // 배경 이미지 제거
  const handleDeleteBackgroundImage = async () => {
    try {
      await userService.deleteBackgroundImage();
      const updatedUser = await userService.getMyUserInfo();
      setUser(updatedUser);
      dispatch(userReducerActions.setUser(updatedUser));
      showNotification('배경 이미지가 삭제되었습니다.');
    } catch (err) {
      console.error('삭제 에러:', err);
      showNotification('배경 이미지 삭제 실패', 'error');
    }
  };
  
  // URL 새 탭 이동
  const handleGoToUrl = () => {
    if (user?.url && user.url.trim() !== '') {
      let targetUrl = user.url;
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl;
      }
      window.open(targetUrl, '_blank');
    }
  };

  // 페이지 주소 복사
  const handleCopyPageAddress = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => showNotification('페이지 주소가 복사되었습니다.'))
      .catch(err => {
        console.error('주소 복사 실패:', err);
        showNotification('주소 복사에 실패했습니다.', 'error');
      });
  };

  // 프로필 수정 모달 열기
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

  // 모달 입력값 변경
  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditFields(prev => ({ ...prev, [name]: value }));
  };

  // 정보 수정 저장 (모달에서 Save)
  const handleSaveEdit = async (updatedFields, newProfileImage) => {
    // 모달에서 넘어온 정보를 받아 updateUserInfo 호출
    if (!user) return;
    try {
      const updateData = {
        nickname: updatedFields.nickname || '',
        introduction: updatedFields.bio || '',
        url: updatedFields.url || ''
      };

      console.log('수정 요청 데이터:', updateData);
      console.log('이미지 파일:', newProfileImage);

      // API 호출하여 사용자 정보 + 이미지 파일 함께 업데이트
      await userService.updateUserInfo(updateData, newProfileImage);

      // 업데이트 후 새로운 사용자 정보를 다시 불러옴
      const refreshedUserInfo = await userService.getMyUserInfo();
      console.log('업데이트 후 새로 가져온 정보:', refreshedUserInfo);

      setUser(refreshedUserInfo);
      dispatch(userReducerActions.setUser(refreshedUserInfo));

      setShowEditModal(false);
      showNotification('회원 정보가 업데이트되었습니다.');
    } catch (err) {
      console.error('사용자 정보 업데이트 오류:', err);
      let errorMessage = '회원 정보 업데이트에 실패했습니다.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      showNotification(errorMessage, 'error');
    }
  };

  // 팔로워/팔로잉 모달 열고 닫기
  const handleFollowersClick = () => {
    fetchFollowers();
    setShowFollowersModal(true);
  };
  const handleFollowingClick = () => {
    fetchFollowing();
    setShowFollowingModal(true);
  };
  
  
  // 인증 안됨
  if (!isAuthenticated) {
    return (
      <div className="border-b border-gray-800 py-3 mt-10">
        <div className="flex justify-center items-center h-40 text-gray-500">
          로그인이 필요합니다.
        </div>
      </div>
    );
  }

  // 로딩
  if (loading) {
    return (
      <div className="border-b border-gray-800 py-3 mt-10">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#3cc3ec]" />
        </div>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className="border-b border-gray-800 py-3 mt-10">
        <div className="flex justify-center items-center h-40 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  // 사용자 정보 없음
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
    <div className="relative flex h-[400px] flex-col items-center">
      <div className="relative h-[250px] w-full overflow-hidden group">
        {user.backgroundImage ? (
          <img
            src={user.backgroundImage}
            alt="배경"
            className="absolute inset-0 z-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-gray-700 to-gray-900" />
        )}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition space-x-2">
            <button
              onClick={handleBackgroundImageChange}
              className="text-white bg-black/60 hover:bg-black/80 px-3 py-2 rounded-full text-sm"
              title="배경 이미지 업로드"
            >
              📷 업로드
            </button>
            {user.backgroundImage && (
              <button
                onClick={handleDeleteBackgroundImage}
                className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-full text-sm"
              >
                삭제
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 프로필/정보 */}
      <div className="relative -top-10 w-[1000px] py-3">
        <div className="flex items-start mb-5">
          {/* 프로필 이미지 (이제 모달에서만 수정하므로 클릭 기능 제거) */}
          <div className="relative mr-4 group mt-1">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-700">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="프로필"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-700">
                  <span className="text-white text-lg">
                    {user.nickname?.charAt(0).toUpperCase() ||
                      user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

            {/* 사용자 정보 */}
            <div className='flex-grow mt-7'>
            {/* 프로필 정보 묶음 */}
              <div className="space-y-2">
                {/* 이름과 아이콘들 */}
                <div className="flex items-center justify-center space-x-2">
                  <h1 className="text-lg font-bold text-white">
                    {user.nickname || user.username || '사용자'}
                  </h1>
                  <div className="flex items-center space-x-2">
                  {/* 정보 수정 */}
                  <button
                    className="text-gray-300 hover:text-white"
                    onClick={handleOpenEditModal}
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
                      d="M15.232 5.232l3.536 
                        3.536m-2.036-5.036a2.5 2.5 
                        0 113.536 3.536L6.5 21.036H3v-3.572L16.732 
                        3.732z"
                    />
                  </svg>
                </button>

                {/* URL 링크 아이콘 */}
                <button
                  className={`text-gray-400 hover:text-white ${!user.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={user.url ? `${user.url}로 이동` : '설정된 URL이 없습니다'}
                  onClick={handleGoToUrl}
                  disabled={!user.url}
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
                      d="M10 6H6a2 2 0 
                        00-2 2v10a2 2 0 
                        002 2h10a2 2 0 
                        002-2v-4M14 4h6m0 
                        0v6m0-6L10 14"
                    />
                  </svg>
                </button>

                {/* 페이지 주소 복사 */}
                <button
                  className="text-gray-400 hover:text-white mb-1.5"
                  onClick={handleCopyPageAddress}
                  title="현재 페이지 주소 복사"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-5 relative top-0.5"
                    fill="none" viewBox="0 0 24 21"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 
                        00-2 2v12a2 2 0 
                        002 2h10a2 2 0 
                        002-2v-1M8
                        5a2 2 0 002 2h2a2 
                        2 0 002-2M8
                        5a2 2 0 012-2h2a2 
                        2 0 012 2m0
                        0h2a2 2 0 012 2v3m2 4H10m0
                        0l3-3m-3 3l3 3"
                    />
                  </svg>
                </button>
              </div>
              <div className="ml-auto">
                <WalletInfo />
              </div>
            </div>
            </div>

            {/* 소개/이메일 */}
            <p className='mb-1 text-sm text-gray-400'>
            {user.bio || user.introduction || '안녕하세요'}
            </p>
            {user.email && (
              <p className="text-gray-400 text-xs mb-1">
                {user.email}
              </p>
            )}
          </div>
        </div>
  
        {/* 팔로워/팔로잉 */}
        <div className="flex space-x-3 mb-1 ml-3">
          <button
            className="text-[#3cc3ec] hover:underline flex items-center"
            onClick={() => setShowFollowersModal(true)}
          >
            <span>팔로워 {user.follower || 0}</span>
            <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <span className="text-gray-400">|</span>
          <button
            className="text-[#3cc3ec] hover:underline flex items-center"
            onClick={() => setShowFollowingModal(true)}
          >
            <span>팔로잉 {user.following || 0}</span>
            <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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

      {/* 프로필 수정 모달 */}
      <ProfileEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        editFields={editFields}
        onChange={handleEditFieldChange}
        onSave={handleSaveEdit}
        user={user}
      />

        <FollowModal
          isOpen={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
          isFollowingList={false}
          userId={user.id}
          onNotify={showNotification}
        />

        <FollowModal
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
          isFollowingList={true}
          userId={user.id}
          onNotify={showNotification}
        />
    </div>
    </>
  );
};

export default UserProfile;