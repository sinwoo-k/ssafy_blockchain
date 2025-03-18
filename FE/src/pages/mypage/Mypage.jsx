import React, { useState } from 'react';
import UserProfile from '../../components/mypage/UserProfile';
import ProfileEditModal from '../../components/mypage/ProfileEdit';
import FollowModal from '../../components/mypage/FollowModal';
import TabNavigation from '../../components/mypage/TabNavigation';
import MyNFTList from '../../components/mypage/MyNFTList';
import TransactionHistory from '../../components/mypage/TransactionHistory';
import FavoritesList from '../../components/mypage/FavoritesList';

// 라우팅 역할만 하는 마이페이지 컴포넌트
const MyPage = () => {
  // 탭 선택 상태만 관리
  const [activeTab, setActiveTab] = useState('나의 NFT');

  return (
    <div className="min-h-screen bg-black text-white pt-[80px]">
      {/* 전체 컨테이너 */}
      <div className="mx-auto max-w-4xl px-4">
        {/* 사용자 프로필 */}
        <UserProfile />
        
        {/* 탭 네비게이션 */}
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* 탭 콘텐츠 */}
        <div className="mt-4">
          {activeTab === '나의 NFT' && <MyNFTList />}
          {activeTab === '거래 내역' && <TransactionHistory />}
          {activeTab === '관심 목록' && <FavoritesList />}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
