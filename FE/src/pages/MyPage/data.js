// 임시 데이터 파일 - API 연동 전 테스트용

// 사용자 데이터
export const userData = {
  username: '체인툰유저',
  bio: '웹툰과 NFT를 좋아합니다',
  url: 'https://naver.com',
  email: 'user@chaintoon.com',
  walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
  profileImage: null,
  followers: 120,
  following: 45,
  registrationDate: '2024.01.15 가입',
  balance: {
    eth: 2.34,
    usd: 4324.56,
    nftCount: 23
  }
};

// NFT 데이터
export const nftData = [
  {
    id: 1,
    title: '액션 NFT',
    price: 0.25,
    ethPrice: 0.22,
    owner: 'godWhoo',
    time: '2024.03.10'
  },
  {
    id: 2,
    title: '로맨스 NFT',
    price: 0.18,
    ethPrice: 0.15,
    owner: '체인툰 유저',
    time: '2024.02.25'
  },
  {
    id: 3,
    title: '판타지 NFT',
    price: 0.35,
    ethPrice: 0.32,
    owner: 'godWhoo',
    time: '2024.02.15'
  }
];

// 거래 내역 데이터
export const transactionData = [
  {
    id: 1,
    title: '거래 1',
    price: 0.25,
    quantity: 1,
    from: '0x123...789',
    to: '0xabc...def',
    time: '2024.03.10'
  },
  {
    id: 2,
    title: '거래 2',
    price: 0.18,
    quantity: 1,
    from: '0x123...789',
    to: '0xabc...def',
    time: '2024.02.25'
  },
  {
    id: 3,
    title: '거래 3',
    price: 0.35,
    quantity: 1,
    from: '0xabc...def',
    to: '0x123...789',
    time: '2024.02.15'
  }
];

// 관심 목록 데이터
export const favoritesData = [
  {
    id: 1,
    title: '관심 NFT 1',
    price: 0.25,
    quantity: 1,
    from: '0x123...789',
    to: '0xabc...def',
    time: '2024.03.10'
  },
  {
    id: 2,
    title: '관심 NFT 2',
    price: 0.18,
    quantity: 1,
    from: '0x123...789',
    to: '0xabc...def',
    time: '2024.02.25'
  }
];

// 팔로워 목록 데이터
export const followersData = [
  {
    id: 1,
    username: '체인툰팬1',
    profileImage: null
  },
  {
    id: 2,
    username: '만화사랑',
    profileImage: null
  },
  {
    id: 3,
    username: 'NFT컬렉터',
    profileImage: null
  },
  {
    id: 4,
    username: '웹툰매니아',
    profileImage: null
  },
  {
    id: 5,
    username: '블록체인아티스트',
    profileImage: null
  }
];

// 팔로잉 목록 데이터
export const followingData = [
  {
    id: 1,
    username: '인기작가1',
    profileImage: null
  },
  {
    id: 2,
    username: '액션장인',
    profileImage: null
  },
  {
    id: 3,
    username: '로맨스퀸',
    profileImage: null
  }
];