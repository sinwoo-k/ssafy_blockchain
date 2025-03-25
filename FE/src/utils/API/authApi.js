import axios from 'axios';

// 기본 API URL 설정 - 환경 변수에서 가져오거나 기본값 사용
const BASE_URL = 'https://j12c109.p.ssafy.io/'

// API 인스턴스 생성
const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정 - 토큰 추가
authApi.interceptors.request.use(
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

// 응답 인터셉터 설정 - 에러 처리
authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러가 발생하면 로그아웃 처리 등을 할 수 있음
    if (error.response && error.response.status === 401) {
      // 로그아웃 처리 로직
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// 이메일 인증 코드 요청
const requestEmailVerification = async (email) => {
  try {
    const response = await authApi.post('/api/auth/email-login', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 인증 코드 확인 및 로그인
const verifyEmailCode = async (email, code) => {
  try {
    const response = await authApi.post('/api/auth/verify-code', { email, code });
    
    // 응답에서 토큰 추출하여 저장
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      // 토큰을 기본 헤더에 설정
      authApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 로그아웃 (토큰 제거)
const logout = () => {
  localStorage.removeItem('token');
  // 토큰 헤더 제거
  delete authApi.defaults.headers.common['Authorization'];
};

// 현재 세션이 인증되었는지 확인
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const authService = {
  requestEmailVerification,
  verifyEmailCode,
  logout,
  isAuthenticated,
};

export default authService;