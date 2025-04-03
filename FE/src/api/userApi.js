import API from '../api/API.js'

// 사용자 정보 조회
const getUserInfo = async (userId) => {
  const res = await API.get(`/users/${userId}`);
  return res.data;
};

// 내 정보 조회 API
export const getMyUserInfo = async () => {
  try {
    const res = await API.get('/users/self/information');
    return res.data;
  } catch (error) {
    console.error("내 정보 조회 실패:", error);
    throw error;
  }
};

// 팔로우
const followUser = async (userId) => {
  try {
    const res = await API.put(`/users/following/${userId}`);
    return res.data;
  } catch(error) {
    console.error("팔로우 실패:", error);
    throw error;
  }
};

// 언팔로우
const unfollowUser = async (userId) => {
  try {
    const res = await API.delete(`/users/following/${userId}`);
    return res.data;
  } catch (error) {
    console.error("언팔로우 실패:", error);
    throw error;
  }
};

// 팔로잉 목록 조회
const getFollowing = async (userId, page = 1, pageSize = 10) => {
  try {
    const res = await API.get(`/users/following/${userId}`, { params: { page, pageSize } });
    return res.data;
  } catch (error) {
    console.error("팔로잉 목록 조회 실패:", error);
    throw error;
  }
};

// 팔로워 목록 조회
const getFollowers = async (userId, page = 1, pageSize = 10) => {
  try {
    const res = await API.get(`/users/followers/${userId}`, { params: { page, pageSize } });
    return res.data;
  } catch (error) {
    console.error("팔로워 목록 조회 실패:", error);
    throw error;
  }
};

// 정보수정 함수 수정
const updateUserInfo = async (updateData, imageFile = null) => {
  try {
    console.log('회원 정보 수정 요청 데이터:', updateData);
    
    // FormData 생성
    const formData = new FormData();
    
    // "item" 키에 JSON 데이터를 Blob으로 변환하여 추가
    formData.append(
      "user",
      new Blob([JSON.stringify(updateData)], { type: "application/json" })
    );
    
    // 이미지 파일이 있는 경우 추가
    if (imageFile) {
      formData.append("profileImage", imageFile);
    }
    
    // FormData를 multipart/form-data 형식으로 전송
    const res = await API.patch('/users', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    console.log('회원 정보 업데이트 응답:', res.data);
    return res.data;
  } catch (error) {
    console.error('정보수정 에러:', error.response?.data || error.message);
    throw error;
  }
};


// 배경 이미지 업로드
const updateBackgroundImage = async () => {
  try {
    const res = await API.patch('/users/background-image');
    return res.data;
  } catch (error) {
    console.error('배경 이미지 업로드 에러', error);
    throw error;
  }
};

// 배경 이미지 삭제
const deleteBackgroundImage = async () => {
  try {
    const res = await API.delete('/users/delete-background');
    return res.data;
  } catch (error) {
    console.error('배경 이미지 삭제 에러', error);
    throw error;
  }
};

// 프로필 이미지 제거
const deleteProfileImage = async () => {
  try {
    const res = await API.delete('/users/delete-profile');
    return res.data;
  } catch (error) {
    console.error('프로필 이미지 제거 에러', error);
    throw error;
  }
};


const uploadBackgroundImage = async (formData) => {
  try {
    const res = await API.post('/users/upload-background', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (error) {
    console.error('배경 이미지 업로드 에러:', error);
    throw error;
  }
};

export const userService = {
  getUserInfo,
  getMyUserInfo,
  updateUserInfo,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  deleteProfileImage,
  deleteBackgroundImage,
  updateBackgroundImage,
  // uploadProfileImage,
  uploadBackgroundImage,
};

export default userService;
