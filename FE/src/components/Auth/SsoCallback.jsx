import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { authActions } from '../../redux/reducers/authSlice';
import { userReducerActions } from '../../redux/reducers/userSlice';
import { verifySsoCode } from '../../api/authApi';
import { getMyUserInfo } from '../../api/userApi';

const SsoCallback = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { provider } = useParams();

  useEffect(() => {
    const handleSsoCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code || !provider) {
          throw new Error('유효하지 않은 SSO 파라미터');
        }

        // 상태 파싱
        const stateParams = new URLSearchParams(state);
        const returnPath = stateParams.get('ssoReturnPath') || '/';
        const returnQuery = stateParams.get('ssoReturnQuery') || '{}';

        // 인증 처리
        await verifySsoCode(provider, code);
        const userData = await getMyUserInfo();
        
        // Redux 상태 업데이트
        dispatch(userReducerActions.setAuthenticated(true));
        dispatch(userReducerActions.setUser(userData));

        // 새로고침 포함한 리다이렉트
        const queryString = new URLSearchParams(JSON.parse(returnQuery)).toString();
        const redirectUrl = `${returnPath}${queryString ? `?${queryString}` : ''}`;
        
        // 실제 페이지 리로드 발생
        window.location.assign(redirectUrl);

      } catch (error) {
        console.error('SSO 처리 실패:', error);
        dispatch(authActions.setErrorMessage(
          error.response?.data?.message || 'SSO 로그인 실패'
        ));
        window.location.assign('/'); // 에러 시 홈으로 리다이렉트
      }
    };

    handleSsoCallback();
  }, [location, dispatch]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="mb-4 text-2xl font-bold">로그인 처리 중...</div>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
};

export default SsoCallback;