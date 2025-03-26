// src/utils/API/userApi.js - 사용자 정보 관련 API
import axios from 'axios';

const BASE_URL = 'https://j12c109.p.ssafy.io';

// 인증된 API 인스턴스 생성
const userApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 추가
userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 사용자 정보 조회
const getUserInfo = async (userId) => {
  try {
    const response = await userApi.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 사용자 정보 수정
const updateUserInfo = async (userId, userData) => {
  try {
    const response = await userApi.patch(`/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 팔로워 목록 조회
const getFollowers = async (userId, page = 1, pageSize = 10) => {
  try {
    const response = await userApi.get(`/api/users/followers/${userId}`, {
      params: { page, pageSize }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 팔로잉 목록 조회
const getFollowing = async (userId, page = 1, pageSize = 10) => {
  try {
    const response = await userApi.get(`/api/users/following/${userId}`, {
      params: { page, pageSize }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 팔로우 하기
const followUser = async (userId) => {
  try {
    const response = await userApi.put(`/api/users/following/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 언팔로우 하기
const unfollowUser = async (userId) => {
  try {
    const response = await userApi.delete(`/api/users/following/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 프로필 이미지 삭제
const deleteProfileImage = async () => {
  try {
    const response = await userApi.delete('/api/users/delete-profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userService = {
  getUserInfo,
  updateUserInfo,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  deleteProfileImage
};

export default userService;