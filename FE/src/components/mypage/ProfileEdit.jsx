import React from 'react';

const ProfileEditModal = ({ isOpen, onClose, editFields, onChange, onSave }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-[380px] rounded-lg bg-[#1a1a1a] p-5 text-white shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
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
            className="rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;