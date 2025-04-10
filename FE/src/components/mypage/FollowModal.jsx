// ✅ FollowModal.jsx - 알림 및 실시간 수 반영 + 외부 follow handler 지원
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../api/userApi';

const FollowModal = ({
  isOpen,
  onClose,
  isFollowingList,
  userId,
  onFollowChange,
  onNotify,
  onFollow,
  onUnfollow,
  title,
  users: externalUsers,
  isLoading: externalLoading
}) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = isFollowingList
          ? await userService.getFollowing(userId)
          : await userService.getFollowers(userId);
        const parsed = (data || []).map(u => ({
          ...u,
          followed: u.followd === 'true'
        }));
        setUsers(parsed);
      } catch (err) {
        console.error('팔로우/팔로잉 목록 불러오기 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!externalUsers) fetchUsers();
    else {
      const parsed = (externalUsers || []).map(u => ({ ...u, followed: u.followd === 'true' }));
      setUsers(parsed);
      setIsLoading(!!externalLoading);
    }
  }, [isOpen, userId, isFollowingList, externalUsers, externalLoading]);

  const handleFollow = async (targetId) => {
    try {
      if (onFollow) await onFollow(targetId);
      else await userService.followUser(targetId);
      setUsers(prev => prev.map(u => u.userId === targetId ? { ...u, followed: true } : u));
      onFollowChange?.(1);
      onNotify?.('팔로우했습니다');
    } catch (err) {
      console.error('팔로우 실패:', err);
      onNotify?.('팔로우 실패', 'error');
    }
  };

  const handleUnfollow = async (targetId) => {
    try {
      if (onUnfollow) await onUnfollow(targetId);
      else await userService.unfollowUser(targetId);
      setUsers(prev => prev.map(u => u.userId === targetId ? { ...u, followed: false } : u));
      onFollowChange?.(-1);
      onNotify?.('언팔로우했습니다');
    } catch (err) {
      console.error('언팔로우 실패:', err);
      onNotify?.('언팔로우 실패', 'error');
    }
  };

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-[380px] rounded-lg bg-[#1a1a1a] p-5 text-white shadow-xl max-h-[80vh] flex flex-col">
        <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-xl font-bold">{title || (isFollowingList ? '팔로잉' : '팔로워')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3cc3ec]" />
          </div>
        ) : (
          <div className="overflow-y-auto flex-grow">
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-400">목록이 비어있습니다.</div>
            ) : (
              users.map((user) => (
                <div key={user.userId} className="flex items-center justify-between py-3 border-b border-gray-800">
                  <Link to={`/user/${user.userId}`} className="flex items-center">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-700 mr-3">
                      {user.profile ? (
                        <img src={user.profile} alt="프로필" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-700">
                          <span className="text-gray-400 text-xl">{user.nickname.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div className="font-medium">{user.nickname}</div>
                  </Link>
                  {user.followd === 'me' ? (
                    // 본인인 경우 버튼 표시하지 않음
                    null
                  ) : user.followed ? (
                    <button
                      onClick={() => handleUnfollow(user.userId)}
                      className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                    >
                      언팔로우
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollow(user.userId)}
                      className="px-4 py-1.5 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] text-white text-sm font-medium transition-colors"
                    >
                      팔로우
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowModal;
