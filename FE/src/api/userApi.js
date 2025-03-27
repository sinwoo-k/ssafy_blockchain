// userApi.js (최종 최적화 코드)
import axios from 'axios';

const BASE_URL = 'https://j12c109.p.ssafy.io';

const userApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 쿠키 자동 전송 필수 설정
});

// 사용자 정보 조회
const getUserInfo = async (userId) => {
  const res = await userApi.get(`/api/users/${userId}`);
  return res.data;
};

// 내 정보 조회 API
export const getMyUserInfo = async () => {
  try {
    // 요청 URL 로깅
    console.log('내 정보 요청 URL:', `${BASE_URL}/api/users/myInfo`);
    const res = await userApi.get('/api/users/myInfo');
    return res.data;
  } catch (error) {
    // 더 자세한 에러 정보 로깅
    console.error('내 정보 조회 에러:', error);
    console.error('에러 상세:', error.response?.data || '응답 데이터 없음');
    throw error; // 에러를 상위로 전파하여 적절한 처리 가능하게 함
  }
};

// 나머지 API 함수들은 그대로 유지
export const userService = {
  getUserInfo,
  getMyUserInfo,
};

export default userService;
