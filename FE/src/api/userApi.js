// userApi.js (최종 최적화 코드)
import axios from 'axios';

const BASE_URL = 'https://j12c109.p.ssafy.io/api';

const userApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 쿠키 자동 전송 필수 설정
});

// 사용자 정보 조회
const getUserInfo = async (userId) => {
  const res = await userApi.get(`/users/${userId}`);
  return res.data;
};

// 내 정보 조회 API
export const getMyUserInfo = async () => {
  try {
    const res = await userApi.get('/users/myInfo');
    console.log(res)
    return res.data;
    
  } catch (error) {
    console.log(error)
  }
};

// 나머지 API 함수들은 그대로 유지
export const userService = {
  getUserInfo,
  getMyUserInfo,
};

export default userService;