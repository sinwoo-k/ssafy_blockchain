import React from 'react';

const UserProfile = ({ user, onEditProfile, onCopyAddress }) => {
  const handleProfileImageChange = () => {
    console.log('프로필 이미지 변경');
  };

  return (
    <div className="border-b border-gray-800 py-4">
      <div className="flex items-start">
        {/* 프로필 이미지 */}
        <div className="relative mr-4 group">
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
            
            {/* 정보 수정 아이콘 */}
            <button 
              className="text-gray-400 hover:text-white"
              onClick={onEditProfile}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            
            {/* 주소 표시 아이콘 */}
            <button className="text-gray-400 hover:text-white" title={user.walletAddress}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </button>
            
            {/* 주소 복사 아이콘 */}
            <button className="text-gray-400 hover:text-white" onClick={onCopyAddress}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-400 text-sm mb-1">{user.bio || '안녕하세요'}</p>
          
          {/* 팔로워/팔로잉 버튼 */}
          <div className="flex space-x-3 mb-1">
            <button className="text-xs text-[#3cc3ec] hover:underline">
              팔로워 {user.followers}
            </button>
            <button className="text-xs text-[#3cc3ec] hover:underline">
              팔로잉 {user.following}
            </button>
          </div>
          
          {/* 가입일 */}
          <div className="flex items-center text-xs text-gray-400">
            <span>{user.registrationDate}</span>
            <span className="mx-2">|</span>
            <span>$</span>
          </div>
        </div>
        
        {/* 잔액 정보 */}
        <div className="text-right text-sm">
          <div className="mb-1">
            <span className="text-xs text-gray-400 mr-2">수지익</span>
            <span>{user.balance.eth} ETH</span>
          </div>
          <div className="mb-1">
            <span className="text-xs text-gray-400 mr-2">USD가치</span>
            <span>$ {user.balance.usd}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 mr-2">NFT</span>
            <span>{user.balance.nftCount}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;