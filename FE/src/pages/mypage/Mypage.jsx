import React, { useState } from 'react';
import UserProfile from '../../components/mypage/UserProfile';
import WalletInfo from '../../components/mypage/WalletInfo';
import ProfileEditModal from '../../components/mypage/ProfileEdit';
import FollowModal from '../../components/mypage/FollowModal';
import TabNavigation from '../../components/mypage/TabNavigation';
import MyNFTList from '../../components/mypage/MyNFTList';
import TransactionHistory from '../../components/mypage/SellingMyNFT';
import FavoritesList from '../../components/mypage/BiddingMyNFT';
import SellingMyNFT from '../../components/mypage/SellingMyNFT';
import BiddingMyNFT from '../../components/mypage/BiddingMyNFT';
import BoughtMyNFT from '../../components/mypage/BoughtMyNFT';
import SoldMyNFT from '../../components/mypage/SoldMyNFT';
import { useSelector } from 'react-redux';

const MyPage = () => {
  // 탭 선택 상태만 관리
  const [activeTab, setActiveTab] = useState('나의 NFT');
  const { isAuthenticated } = useSelector(state => state.user);

  return (
    <div className="min-h-screen bg-black text-white pt-[80px] relative">
      
      {/* 전체 컨테이너 */}
      <div className="mx-auto max-w-4xl">
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
          {activeTab === '판매중인 아이템' && <SellingMyNFT />}
          {activeTab === '입찰중인 아이템' && <BiddingMyNFT />}
          {activeTab === '구매 내역' && <BoughtMyNFT />}
          {activeTab === '판매 내역' && <SoldMyNFT />}
        </div>
      </div>
    </div>
  );
};

export default MyPage;