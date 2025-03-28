import API from './API';

// 사용자 정보 조회
const getUserInfo = async (userId) => {
  const res = await API.get(`/users/${userId}`);
  return res.data;
};

// 내 정보 조회 API
export const getMyUserInfo = async () => {
  try {
    const res = await API.get('/users/myInfo');
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