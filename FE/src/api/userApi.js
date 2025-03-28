// userApi.js에 기존 함수를 유지하면서 새로운 API 함수 추가

import API from '../api/API.js'

// 사용자 정보 조회
const getUserInfo = async (userId) => {
  const res = await API.get(`/users/${userId}`);
  return res.data;
};

// 내 정보 조회 API
export const getMyUserInfo = async () => {
  try {
    const res = await API.get('/users/my-info');
    return res.data;
  } catch (error) {
    console.error("내 정보 조회 실패:", error);
    throw error;
  }
};

// 회원 정보 수정
const updateUserInfo = async (userId, userData) => {
  try {
    console.log('회원정보 수정 요청:'.{userId, userData})

    const res = await API.patch(`/users`, userData);
    return res.data;
  } catch (error) {
    console.error("회원 정보 수정 실패:", error);
    if (error.response){
      console.error('응답데이터:', error.response.data);
    }
    throw error;
  }
};

// 닉네임 중복 체크
const checkNicknameExists = async (nickname) => {
  try {
    const res = await API.get(`/users/is-exist/${nickname}`);
    return res.data;
  } catch (error) {
    console.error("닉네임 중복 체크 실패:", error);
    throw error;
  }
};

// 프로필 이미지 제거
const deleteProfileImage = async () => {
  try {
    const res = await API.delete('/users/delete-profile');
    return res.data;
  } catch (error) {
    console.error("프로필 이미지 제거 실패:", error);
    throw error;
  }
};

// 배경 이미지 제거
const deleteBackgroundImage = async () => {
  try {
    const res = await API.delete('/users/delete-background');
    return res.data;
  } catch (error) {
    console.error("배경 이미지 제거 실패:", error);
    throw error;
  }
};

// 팔로우하기
const followUser = async (userId) => {
  try {
    const res = await API.put(`/users/following/${userId}`);
    return res.data;
  } catch (error) {
    console.error("팔로우 실패:", error);
    throw error;
  }
};

// 언팔로우하기
const unfollowUser = async (userId) => {
  try {
    const res = await API.delete(`/users/following/${userId}`);
    return res.data;
  } catch (error) {
    console.error("언팔로우 실패:", error);
    throw error;
  }
};

// 팔로우 목록 조회
const getFollowing = async (userId, page = 1, pageSize = 10) => {
  try {
    const res = await API.get(`/users/following/${userId}`, {
      params: { page, pageSize }
    });
    return res.data;
  } catch (error) {
    console.error("팔로우 목록 조회 실패:", error);
    throw error;
  }
};

// 팔로워 목록 조회
const getFollowers = async (userId, page = 1, pageSize = 10) => {
  try {
    const res = await API.get(`/users/followers/${userId}`, {
      params: { page, pageSize }
    });
    return res.data;
  } catch (error) {
    console.error("팔로워 목록 조회 실패:", error);
    throw error;
  }
};

// 프로필 이미지 업로드
const uploadProfileImage = async (formData) => {
  try {
    const res = await API.post('/users/upload-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (error) {
    console.error("프로필 이미지 업로드 실패:", error);
    throw error;
  }
};

// 배경 이미지 업로드
const uploadBackgroundImage = async (formData) => {
  try {
    const res = await API.post('/users/upload-background', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (error) {
    console.error("배경 이미지 업로드 실패:", error);
    throw error;
  }
};

export const userService = {
  getUserInfo,
  getMyUserInfo,
  updateUserInfo,
  checkNicknameExists,
  deleteProfileImage,
  deleteBackgroundImage,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  uploadProfileImage,
  uploadBackgroundImage
};

export default userService;