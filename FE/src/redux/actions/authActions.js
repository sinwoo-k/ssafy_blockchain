import { authActions } from '../reducers/authSlice';
import { userReducerActions } from '../reducers/userSlice';
import { authService } from '../../api/authApi';
import { loginWithMetaMask } from '../../utils/metamask';

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

    const userData = await authService.verifyEmailCode(email, code);

    // localStorage에 JWT 저장하는 코드 삭제
    dispatch(userReducerActions.setAuthenticated(true));
    dispatch(userReducerActions.setUser(userData.user));

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
