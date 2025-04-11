import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyUserInfo } from '../../redux/actions/authActions';
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

const MyPage = () => {
  // 탭 선택 상태 관리
  const [activeTab, setActiveTab] = useState('나의 NFT');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { isAuthenticated } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsPageLoading(true);
        const userData = await dispatch(fetchMyUserInfo());
        if (!userData) {
          // 인증 실패 시 홈으로 리다이렉트
          navigate('/');
        }
      } catch (err) {
        console.error('인증 상태 확인 실패:', err);
        navigate('/');
      } finally {
        setIsPageLoading(false);
      }
    };
    
    checkAuth();
  }, [dispatch, navigate]);

  // 로딩 중일 때 로딩 화면 표시
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3cc3ec]"></div>
      </div>
    );
  }

  // 인증 확인 후 마이페이지 표시
  return (
    <div className="min-h-screen bg-black text-white pt-[62px] relative">
      {/* 전체 컨테이너 */}
      <div className="mx-auto max-w-5xl ">
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