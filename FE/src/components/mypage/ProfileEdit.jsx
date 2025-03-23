import React from 'react';

const ProfileEditModal = ({ isOpen, onClose, editFields, onChange, onSave, user }) => {
  if (!isOpen) return null;
  
  // 프로필 이미지 변경 함수
  const handleProfileImageChange = () => {
    console.log('프로필 이미지 변경 (모달에서)');
    // 실제 구현에서는 이미지 업로드 로직 추가
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-[380px] rounded-lg bg-[#1a1a1a] p-5 text-white shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* 프로필 이미지 (편집 가능) */}
            <div className="relative mr-4 group">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-700">
                {user?.profileImage ? (
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
            
            <h2 className="text-lg font-bold"></h2>
          </div>
          
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-300">사용자 이름</label>
          <input
            type="text"
            name="username"
            value={editFields.username}
            onChange={onChange}
            className="w-full rounded bg-white/10 p-2 text-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-300">작가의 말</label>
          <input
            type="text"
            name="bio"
            value={editFields.bio}
            onChange={onChange}
            className="w-full rounded bg-white/10 p-2 text-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-300">URL</label>
          <input
            type="text"
            name="url"
            value={editFields.url}
            onChange={onChange}
            className="w-full rounded bg-white/10 p-2 text-white"
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-1 text-sm text-gray-300">이메일 주소</label>
          <input
            type="email"
            name="email"
            value={editFields.email}
            onChange={onChange}
            className="w-full rounded bg-white/10 p-2 text-white"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="rounded px-4 py-1 text-white hover:bg-gray-700"
          >
            취소
          </button>
          <button 
            onClick={onSave}
            className="rounded bg-[#3cc3ec] px-4 py-1 text-black hover:bg-[#2aabda]"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;