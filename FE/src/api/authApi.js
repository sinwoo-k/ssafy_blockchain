import axios from 'axios';

const BASE_URL = 'https://j12c109.p.ssafy.io';

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 쿠키 자동 전송 필수 설정!
});

export const requestEmailVerification = async (email) => {
  const res = await authApi.post('/api/auth/email-login', { email });
  return res.data;
};

export const verifyEmailCode = async (email, code) => {
  const res = await authApi.post('/api/auth/verify-code', { email, code });
  return res.data;
};

export const requestMetaMaskNonce = async (address) => {
  const res = await authApi.get(`/api/nft/nonce?walletAddress=${address}`);
  return res.data.nonce;
};

export const verifyMetaMaskSignature = async (address, signature, nonce) => {
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
