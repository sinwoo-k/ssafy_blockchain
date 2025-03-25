// redux/actions/authActions.js
import { authActions } from '../reducers/authSlice';
import { userReducerActions } from '../reducers/userSlice';
import authService from '../../utils/API/authApi';


// 이메일 인증 코드 요청 액션
export const requestEmailVerification = (email) => async (dispatch) => {
  try {
    dispatch(authActions.setLoading(true));
    dispatch(authActions.setErrorMessage(''));
    dispatch(authActions.setEmail(email));
    
    // API 호출
    await authService.requestEmailVerification(email);
    
    // 성공 처리
    dispatch(authActions.setLoginStep(1));
  } catch (error) {
    // 오류 처리
    let errorMessage = '인증 코드 발송 중 오류가 발생했습니다.';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    dispatch(authActions.setErrorMessage(errorMessage));
  } finally {
    dispatch(authActions.setLoading(false));
  }
};

// 인증 코드 확인 액션
export const verifyEmailCode = (email, code) => async (dispatch) => {
  try {
    dispatch(authActions.setLoading(true));
    dispatch(authActions.setErrorMessage(''));
    
    // API 호출
    const userData = await authService.verifyEmailCode(email, code);
    
    // 성공 처리
    if (userData.token) {
      dispatch(userReducerActions.setToken(userData.token));
    }
    if (userData.user) {
      dispatch(userReducerActions.setUser(userData.user));
    }
    dispatch(userReducerActions.setAuthenticated(true));
    dispatch(authActions.resetAuthState());
    
    return true; // 성공 신호 반환
  } catch (error) {
    // 오류 처리
    let errorMessage = '인증 코드 확인 중 오류가 발생했습니다.';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    dispatch(authActions.setErrorMessage(errorMessage));
    return false; // 실패 신호 반환
  } finally {
    dispatch(authActions.setLoading(false));
  }
};

// 로그아웃 액션
export const logout = () => (dispatch) => {
  authService.logout();
  dispatch(userReducerActions.logout());
};

// 자동 로그인 체크 액션
export const checkAutoLogin = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    // 토큰 유효성 검증 API 호출 (API가 있다면)
    // const userData = await authService.validateToken(token);
    
    // 간단한 구현 - 토큰이 있으면 로그인 상태로 간주
    dispatch(userReducerActions.setToken(token));
    dispatch(userReducerActions.setAuthenticated(true));
    
    // 사용자 정보 가져오기 API 호출 (API가 있다면)
    // const userInfo = await authService.getUserInfo();
    // dispatch(userReducerActions.setUser(userInfo));
  } catch (error) {
    // 토큰이 유효하지 않으면 로그아웃
    dispatch(userReducerActions.logout());
  }
};