import API from './API';

export const requestEmailVerification = async (email) => {
  const res = await API.post('/auth/email-login', { email });
  return res.data;
};

export const verifyEmailCode = async (email, code) => {
  const res = await API.post('/auth/verify-code', { email, code });
  return res.data;
};

export const requestMetaMaskNonce = async (address) => {
  const res = await API.get(`/nft/nonce?walletAddress=${address}`);
  return res.data.nonce;
};

export const verifyMetaMaskSignature = async (address, signature, nonce) => {
  const res = await API.post('/nft/connect-wallet', {
    walletAddress: address,
    signature,
    message: nonce,
  });
  return res.data;
};

export const logout = async () => {
  const res = await API.post('/auth/logout');
  return res.data;
};


export const authService = {
  requestEmailVerification,
  verifyEmailCode,
  requestMetaMaskNonce,
  verifyMetaMaskSignature,
  logout
};

export default authService;