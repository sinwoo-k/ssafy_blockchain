import React, { useState } from 'react';
import UserProfile from '../../components/mypage/UserProfile';
import ProfileEditModal from '../../components/mypage/ProfileEdit';
import TabNavigation from '../../components/mypage/TabNavigation';
import MyNFTList from '../../components/mypage/MyNFTList';
import TransactionHistory from '../../components/mypage/TransactionHistory';
import FavoritesList from '../../components/mypage/FavoritesList';

// 초기 데이터를 위한 모듈을 별도로 만들 수도 있습니다
import { userData, nftData, transactionData, favoritesData } from './data';

const MyPage = () => {
  // 상태들을 메인 컴포넌트에서 관리합니다
  const [user, setUser] = useState(userData);
  const [activeTab, setActiveTab] = useState('나의 NFT');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFields, setEditFields] = useState({
    username: user.username,
    bio: user.bio || '',
    url: user.url || '',
    email: user.email || ''
  });

  // 주소 복사 함수
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user.walletAddress)
      .then(() => {
        console.log('주소가 클립보드에 복사되었습니다.');
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

  // NFT 판매 함수
  const handleSellNft = (id) => {
    console.log(`NFT ID ${id} 판매 시작`);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-[80px]">
      {/* 전체 컨테이너 */}
      <div className="mx-auto max-w-4xl px-4">
        {/* 사용자 프로필 */}
        <UserProfile 
          user={user} 
          onEditProfile={handleOpenEditModal} 
          onCopyAddress={handleCopyAddress} 
        />

        {/* 탭 네비게이션 */}
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* 탭 콘텐츠 */}
        <div className="mt-4">
          {activeTab === '나의 NFT' && <MyNFTList transactions={nftData} onSellNft={handleSellNft} />}
          {activeTab === '거래 내역' && <TransactionHistory transactions={transactionData} />}
          {activeTab === '관심 목록' && <FavoritesList favorites={favoritesData} />}
        </div>
      </div>

      {/* 프로필 수정 모달 */}
      <ProfileEditModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        editFields={editFields}
        onChange={handleEditFieldChange}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default MyPage;