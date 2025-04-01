import React, { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/reducers/authSlice';
import { userReducerActions } from '../../redux/reducers/userSlice';
import { verifySsoCode } from '../../api/authApi';
import { getMyUserInfo } from '../../api/userApi';

const SsoCallback = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { provider } = useParams();

  useEffect(() => {
    const handleSsoCallback = async () => {
      try {
        // 1. URL에서 code와 state 추출
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code) {
          throw new Error('인가 코드가 없습니다.');
        }

        if (!provider) {
            throw new Error('잘못된 SSO provider입니다.')
        }

        // 2. state 파라미터 파싱 (복귀 경로 정보)
        const stateParams = new URLSearchParams(state);
        const returnPath = stateParams.get('ssoReturnPath') || '/';
        const returnQuery = JSON.parse(stateParams.get('ssoReturnQuery') || '{}');

        // 3. 백엔드에 인가 코드 전송, 성공 시 JwT 쿠키 설정
        await verifySsoCode(provider, code);
        
        // 4. Redux에 인증 상태 저장
        const userData = await getMyUserInfo();
        dispatch(userReducerActions.setAuthenticated(true));
        dispatch(userReducerActions.setUser(userData));

        // 5. 원래 페이지로 복귀
        navigate(returnPath, { state: returnQuery });

      } catch (error) {
        console.error('SSO 콜백 처리 실패:', error);
        dispatch(authActions.setErrorMessage(
          error.response?.data?.message || 
          'SSO 로그인에 실패했습니다. 다시 시도해주세요.'
        ));
        navigate('/');
      }
    };

    handleSsoCallback();
  }, [location, dispatch, navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="mb-4 text-2xl font-bold">로그인 처리 중...</div>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
};

export default SsoCallback;