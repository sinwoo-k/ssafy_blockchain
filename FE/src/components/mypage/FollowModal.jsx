import React from 'react';

const FollowModal = ({ isOpen, onClose, title, users, onFollow, onUnfollow, isFollowingList }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-[380px] rounded-lg bg-[#1a1a1a] p-5 text-white shadow-xl max-h-[80vh] flex flex-col">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 사용자 목록 - 스크롤 가능 */}
        <div className="overflow-y-auto flex-grow">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              목록이 비어있습니다.
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-3 border-b border-gray-800">
                {/* 사용자 정보 (프로필 이미지 + 이름) */}
                <div className="flex items-center">
                  {/* 프로필 이미지 */}
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-700 mr-3">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={`${user.username} 프로필`} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-700">
                        <span className="text-gray-400 text-xl">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* 사용자 이름 */}
                  <div className="font-medium">{user.username}</div>
                </div>
                
                {/* 팔로우/언팔로우 버튼 */}
                {isFollowingList ? (
                  <button 
                    onClick={() => onUnfollow(user.id)}
                    className="text-gray-400 hover:text-white"
                    title="언팔로우"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <button 
                    onClick={() => onFollow(user.id)}
                    className="px-3 py-1 bg-[#3cc3ec] hover:bg-[#2aabda] text-black rounded-full text-xs"
                  >
                    팔로우
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowModal;