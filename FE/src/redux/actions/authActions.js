import { authActions } from '../reducers/authSlice';
import { userReducerActions } from '../reducers/userSlice';
import { authService } from '../../api/authApi';
import { loginWithMetaMask } from '../../utils/metamask';

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

export const verifyEmailCode = (email, code) => async (dispatch) => {
  try {
    dispatch(authActions.setLoading(true));
    dispatch(authActions.setErrorMessage(''));

    const userData = await authService.verifyEmailCode(email, code);

    dispatch(userReducerActions.setAuthenticated(true));
    dispatch(userReducerActions.setUser(userData.user));
    localStorage.setItem('token', userData.token);

  } catch (error) {
    const errorMessage = error.response?.data?.message || '인증 코드 확인 실패';
    dispatch(authActions.setErrorMessage(errorMessage));
  } finally {
    dispatch(authActions.setLoading(false));
  }
};

export const metaMaskLoginAction = () => async (dispatch) => {
  try {
    dispatch(authActions.setLoading(true));
    dispatch(authActions.setErrorMessage(''));

    const { address, signature, nonce } = await loginWithMetaMask(authService.requestMetaMaskNonce);
    const response = await authService.verifyMetaMaskSignature(address, signature, nonce);

    dispatch(userReducerActions.setAuthenticated(true));
    dispatch(userReducerActions.setUser(response.user));
    localStorage.setItem('token', response.token);
  } catch (error) {
    const msg = error.message || error.response?.data?.message || '메타마스크 로그인 실패';
    dispatch(authActions.setErrorMessage(msg));
  } finally {
    dispatch(authActions.setLoading(false));
  }
};
