// src/utils/metamask.js

export const isMetaMaskInstalled = () => window.ethereum && window.ethereum.isMetaMask;

export const connectMetaMask = async () => {
  if (!isMetaMaskInstalled()) throw new Error("메타마스크가 설치되지 않았습니다.");

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const address = accounts[0];

  return address;
};

export const signMessage = async (message, address) => {
  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [message, address],
  });
  return signature;
};

export const loginWithMetaMask = async (getNonce) => {
  const address = await connectMetaMask();
  const nonce = await getNonce(address);
  const signature = await signMessage(nonce, address);

  return { address, signature, nonce };
};

// 추가로 꼭 필요한 메타마스크 리스너 설정 함수
export const setupMetaMaskListeners = (onAccountsChanged, onChainChanged, onDisconnect) => {
  if (!isMetaMaskInstalled()) return;

  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0 && onDisconnect) {
      onDisconnect();
    } else if (onAccountsChanged) {
      onAccountsChanged(accounts[0]);
    }
  });

  window.ethereum.on('chainChanged', (chainId) => {
    if (onChainChanged) onChainChanged(chainId);
  });
};

// 이벤트 리스너 제거 함수 추가
export const removeMetaMaskListeners = () => {
  if (!isMetaMaskInstalled()) return;

  window.ethereum.removeAllListeners('accountsChanged');
  window.ethereum.removeAllListeners('chainChanged');
};
