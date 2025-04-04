import React, { useState } from 'react';

const ProfileEditModal = ({
  isOpen,
  onClose,
  editFields,
  onChange,
  onSave,
  user
}) => {
  // 모달에서 새로운 프로필 이미지를 담을 state
  const [newProfileImage, setNewProfileImage] = useState(null);

  if (!isOpen) return null;

  // 프로필 이미지 변경 로직 (input[type="file"] 사용)
  const handleProfileImageChange = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // 선택한 이미지 파일을 state에 저장
        setNewProfileImage(file);
      }
    };
    fileInput.click();
  };

  // 저장 버튼 클릭 시
  const handleSaveButton = () => {
    // onSave 함수에 이미지 파일까지 함께 전달
    onSave(editFields, newProfileImage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-[380px] rounded-lg bg-[#1a1a1a] p-5 text-white shadow-xl">
        
        {/* 상단 영역 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* 프로필 이미지 + 수정 아이콘 */}
            <div className="relative mr-4 group">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-700">
                {newProfileImage ? (
                  /* 사용자가 새로 선택한 이미지를 미리보기 */
                  <img
                    src={URL.createObjectURL(newProfileImage)}
                    alt="새 프로필 미리보기"
                    className="h-full w-full object-cover"
                  />
                ) : user?.profileImage ? (
                  /* 기존 프로필 이미지 */
                  <img
                    src={user.profileImage}
                    alt="프로필"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  /* 이미지가 전혀 없는 경우 */
                  <div className="flex h-full w-full items-center justify-center bg-gray-700" />
                )}
              </div>
              
              {/* 마우스 오버 시 보이는 수정 버튼 */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleProfileImageChange}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 
                      2 0 001.664-.89l.812-1.22A2 2 0 
                      0110.07 4h3.86a2 2 0 
                      011.664.89l.812 1.22A2 2 0 
                      0018.07 7H19a2 2 0 012 
                      2v9a2 2 0 01-2 2H5a2 
                      2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 
                      11-6 0 3 3 0 
                      016 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 닉네임 */}
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-300">닉네임</label>
          <input
            type="text"
            name="nickname"
            value={editFields.nickname || ''}
            onChange={onChange}
            className="w-full rounded bg-white/10 p-2 text-white"
          />
        </div>

        {/* 작가의 말 (bio) */}
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

        {/* URL */}
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

        {/* 버튼들 */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="rounded px-4 py-1 text-white hover:bg-gray-700"
          >
            취소
          </button>
          <button
            onClick={handleSaveButton}
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
