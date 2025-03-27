import { authActions } from '../reducers/authSlice';
import { userReducerActions } from '../reducers/userSlice';
import { authService } from '../../api/authApi';
import { loginWithMetaMask } from '../../utils/metamask';
import { getMyUserInfo } from '../../api/userApi';

// 내 정보를 가져와서 리덕스에 저장하는 액션
export const fetchMyUserInfo = () => async (dispatch) => {
  try {
    const userData = await getMyUserInfo();
    dispatch(userReducerActions.setAuthenticated(true));
    dispatch(userReducerActions.setUser(userData));
    return userData; // ✅ 추가: 호출 측에서 활용 가능
  } catch (error) {
    dispatch(userReducerActions.logout());
    throw error; // ✅ 추가: 호출 측에서 에러 핸들링 가능
  }
};

// 이메일 인증 요청 액션
export const requestEmailVerification = (email) => async (dispatch) => {
  try {
    dispatch(authActions.setLoading(true));
    dispatch(authActions.setErrorMessage(''));
    dispatch(authActions.setEmail(email));

    await authService.requestEmailVerification(email);
    dispatch(authActions.setLoginStep(1));
  } catch (error) {
    dispatch(authActions.setErrorMessage(error.response?.data?.message || '인증 코드 발송 실패'));
  } finally {
    dispatch(authActions.setLoading(false));
  }
};

// 이메일 코드 검증 액션 (localStorage 저장 코드 삭제)
export const verifyEmailCode = (email, code) => async (dispatch) => {
  try {
    dispatch(authActions.setLoading(true));
    dispatch(authActions.setErrorMessage(''));

    // 1. 인증 요청 → JWT 쿠키 설정됨
    await authService.verifyEmailCode(email, code);

    // 2. JWT로 내 정보 요청 → 사용자 정보 받아오기
    const userData = await getMyUserInfo();

    // 3. 리덕스 상태 업데이트
    dispatch(userReducerActions.setAuthenticated(true));
    dispatch(userReducerActions.setUser(userData));

  } catch (error) {
    dispatch(authActions.setErrorMessage(error.response?.data?.message || '인증 코드 확인 실패'));
  } finally {
    dispatch(authActions.setLoading(false));
  }
};

// 메타마스크 로그인 액션 (JWT 직접 저장 삭제)
export const metaMaskLoginAction = () => async (dispatch) => {
  try {
    dispatch(authActions.setLoading(true));
    dispatch(authActions.setErrorMessage(''));

    const { address, signature, nonce } = await loginWithMetaMask(authService.requestMetaMaskNonce);
    const response = await authService.verifyMetaMaskSignature(address, signature, nonce);

    // localStorage에 JWT 저장하는 코드 삭제
    dispatch(userReducerActions.setAuthenticated(true));
    dispatch(userReducerActions.setUser(response.user));

  } catch (error) {
    dispatch(authActions.setErrorMessage(error.message || '메타마스크 로그인 실패'));
  } finally {
    dispatch(authActions.setLoading(false));
  }
};

// 인증상태 체크 (새롭게 추가)
export const checkAuthStatus = () => async (dispatch) => {
  try {
    const res = await authService.get('/api/auth/status');
    dispatch(userReducerActions.setAuthenticated(res.data.isAuthenticated));
    dispatch(userReducerActions.setUser(res.data.user));
  } catch {
    dispatch(userReducerActions.logout());
  }
};

export const logoutAction = () => async (dispatch) => {
  try {
    // 백엔드에 로그아웃 요청하여 쿠키 삭제
    await authService.logout();
    // 로컬 스토리지 클리어
    if (localStorage.getItem('authMethod')) {
      localStorage.removeItem('authMethod');
    }
    // 리덕스 상태 초기화
    dispatch(userReducerActions.logout());
  } catch (error) {
    console.error('로그아웃 처리 중 오류 발생:', error);
    // 오류가 발생해도 프론트 상태는 초기화
    if (localStorage.getItem('authMethod')) {
      localStorage.removeItem('authMethod');
    }
    dispatch(userReducerActions.logout());
  }
};