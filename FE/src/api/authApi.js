import axios from 'axios';

const BASE_URL = 'https://j12c109.p.ssafy.io';

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials :true,
});

authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 이메일 인증 코드 요청 (추가 필수!)
const requestEmailVerification = async (email) => {
  const res = await authApi.post('/api/auth/email-login', { email });
  return res.data;
};

// 이메일 인증 코드 검증 (추가 필수!)
const verifyEmailCode = async (email, code) => {
  const res = await authApi.post('/api/auth/verify-code', { email, code });
  return res.data;
};

// 메타마스크 논스 요청
const requestMetaMaskNonce = async (address) => {
  const res = await authApi.get(`/api/nft/nonce?walletAddress=${address}`);
  return res.data.nonce;
};

// 메타마스크 서명 검증
const verifyMetaMaskSignature = async (address, signature, nonce) => {
  const res = await authApi.post('/api/nft/connect-wallet', {
    walletAddress: address,
    signature,
    message: nonce,
  });
  return res.data;
};

export const authService = {
  requestEmailVerification,
  verifyEmailCode,
  requestMetaMaskNonce,
  verifyMetaMaskSignature,
};

export default authApi;
