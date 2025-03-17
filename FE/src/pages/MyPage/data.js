// 사용자 데이터
export const userData = {
    username: 'user',
    profileImage: null,
    bio: '안녕하세요',
    url: '',
    email: '',
    registrationDate: '2023년 8월',
    walletAddress: '0x1234...5678',
    followers: 300,
    following: 500,
    balance: {
      eth: 0.00,
      usd: 0.00,
      nftCount: 0,
    }
  };
  
  // NFT 목록 데이터
  export const nftData = [
    { id: 1, type: '판매', name: '웹툰 1화', price: 9.63, ethPrice: 8.92, listPrice: 9.33, marketplace: 'GodWhoo', time: '1h ago' },
    { id: 2, type: '판매', name: '웹툰 2화', price: 9.63, ethPrice: 8.92, listPrice: 9.33, marketplace: 'GodWhoo', time: '49m ago' },
    { id: 3, type: '판매', name: '웹툰 3화', price: 9.63, ethPrice: 8.92, listPrice: 9.33, marketplace: 'GodWhoo', time: '28s ago' },
    { id: 4, type: '판매', name: '웹툰 4화', price: 9.63, ethPrice: 8.92, listPrice: 9.33, marketplace: 'GodWhoo', time: '1h ago' },
    { id: 5, type: '판매', name: '웹툰 5화', price: 9.63, ethPrice: 8.92, listPrice: 9.33, marketplace: 'GodWhoo', time: '1h ago' },
  ];
  
  // 거래 이력 데이터
  export const transactionData = [
    { id: 1, type: '판매', name: '웹툰 1화', price: 9.63, quantity: 1, from: 'User 1', to: 'GodWhoo', time: '1h ago' },
    { id: 2, type: '판매', name: '웹툰 2화', price: 9.63, quantity: 1, from: 'User 22', to: 'GodWhoo', time: '49m ago' },
    { id: 3, type: '판매', name: '웹툰 3화', price: 9.63, quantity: 2, from: 'User 1', to: 'GodWhoo', time: '28s ago' },
    { id: 4, type: '판매', name: '웹툰 4화', price: 9.63, quantity: 1, from: 'User 88', to: 'GodWhoo', time: '1h ago' },
    { id: 5, type: '판매', name: '웹툰 5화', price: 9.63, quantity: 3, from: 'User 99', to: 'GodWhoo', time: '1h ago' },
  ];
  
  // 관심 목록 데이터
  export const favoritesData = [
    { id: 1, type: '판매', name: '웹툰 1화', price: 9.63, quantity: 1, from: 'User 1', to: 'GodWhoo', time: '1h ago' },
    { id: 2, type: '판매', name: '웹툰 2화', price: 9.63, quantity: 1, from: 'User 22', to: 'GodWhoo', time: '49m ago' },
    { id: 3, type: '판매', name: '웹툰 3화', price: 9.63, quantity: 2, from: 'User 1', to: 'GodWhoo', time: '28s ago' },
    { id: 4, type: '판매', name: '웹툰 4화', price: 9.63, quantity: 1, from: 'User 88', to: 'GodWhoo', time: '1h ago' },
    { id: 5, type: '판매', name: '웹툰 5화', price: 9.63, quantity: 3, from: 'User 99', to: 'GodWhoo', time: '1h ago' },
  ];