import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../redux/reducers/authSlice';
import { userReducerActions } from '../../redux/reducers/userSlice';
import { metaMaskLoginAction, requestEmailVerification, verifyEmailCode } from '../../redux/actions/authActions';
import { isMetaMaskInstalled } from '../../utils/metamask';
import LogoImg from '../../assets/logo2.png';
import saffylogo from '../../assets/ssafylogo.png';
import metamasklogo from '../../assets/metamask_logo.png';
import { getAuthorizationUri } from '../../api/authApi';

const LoginModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loginStep, isLoading, errorMessage, email: reduxEmail } = useSelector(state => state.auth);
  const { isAuthenticated } = useSelector(state => state.user);

  const [email, setEmail] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);

  useEffect(() => {
    setIsMetaMaskAvailable(isMetaMaskInstalled());
  }, []);

  useEffect(() => {
    if (reduxEmail) setEmail(reduxEmail);
  }, [reduxEmail]);

  useEffect(() => {
    if (isAuthenticated) onClose();
  }, [isAuthenticated, onClose]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(authActions.resetAuthState());
      setInputCode('');
      setEmail('');
    }
  }, [isOpen, dispatch]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    dispatch(authActions.setEmail(e.target.value));
  };

  const handleSendVerificationCode = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(authActions.setErrorMessage('유효한 이메일 주소를 입력해주세요'));
      return;
    }
    dispatch(requestEmailVerification(email));
  };

  const handleVerifyCode = () => {
    if (inputCode.length !== 12) {
      dispatch(authActions.setErrorMessage('12자리 인증 코드를 입력해주세요'));
      return;
    }
    dispatch(verifyEmailCode(email, inputCode));
  };

  const handleMetaMaskLogin = () => {
    dispatch(metaMaskLoginAction());
  };

  const handleSaffyLogin = async () => {
    try {
      // 1. SSAFY 인가 코드 요청 URL 조회
      const authCodeUrl = await getAuthorizationUri('ssafy');
      
      if (!authCodeUrl) {
        throw new Error('SSAFY 인증 서버에 연결할 수 없습니다.');
      }
  
      // 2. 현재 경로 정보 저장 (로그인 후 복귀용)
      const returnPath = window.location.pathname;
      const returnQuery = JSON.stringify(Object.fromEntries(
        new URLSearchParams(window.location.search)
      ));
  
      // 3. state 파라미터 구성 (URL Safe하게 인코딩)
      const state = new URLSearchParams();
      state.append('ssoReturnPath', returnPath);
      state.append('ssoReturnQuery', returnQuery);
  
      // 4. 인가 URL에 state 추가 후 리다이렉트
      const redirectUrl = new URL(authCodeUrl);
      redirectUrl.searchParams.append('state', state.toString());
      
      window.location.href = redirectUrl.toString();
  
    } catch (error) {
      dispatch(authActions.setErrorMessage(
        error.response?.data?.message || 
        'SSAFY 로그인 처리 중 오류가 발생했습니다.'
      ));
    }
  };

  const handleBackToEmailInput = () => {
    dispatch(authActions.setLoginStep(0));
    setInputCode('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-[400px] rounded-xl bg-[#111111] p-6 text-white shadow-xl">
        {/* 닫기 버튼 */}
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        
        {/* 로고와 제목 */}
        <div className="mb-6 flex flex-col items-center justify-center">
          <img src={LogoImg} alt="체인툰 로고" className="mb-4 w-[150px]" />
          <p className="text-xl font-bold text-white">
            {loginStep === 0 ? "체인툰과 연결" : "인증 코드 확인"}
          </p>
        </div>
        
        {/* 오류 메시지 */}
        {errorMessage && (
          <div className="mb-4 rounded-md bg-red-900/30 p-2 text-center text-sm text-red-300">
            {errorMessage}
          </div>
        )}
        
        {loginStep === 0 ? (
          <>
            {/* 이메일 입력 필드 */}
            <div className="mb-6 flex w-full items-center justify-between rounded-lg bg-[#222222] px-4 py-2 hover:bg-[#2a2a2a]">
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                className="flex-grow bg-transparent text-base text-white outline-none"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendVerificationCode();
                }}
              />
              <button 
                onClick={handleSendVerificationCode}
                className="flex h-[36px] w-[36px] items-center justify-center rounded bg-[#1DA1F2]"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* 구분선 */}
            <div className="relative mb-6 flex items-center">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 flex-shrink text-sm text-gray-400">또는 지갑을 연결하세요</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>
            
            {/* 메타마스크 로그인 버튼 */}
            <button 
              onClick={handleMetaMaskLogin}
              className="mb-4 flex w-full items-center justify-between rounded-lg border border-[#222222] bg-[#111111] px-4 py-3 hover:bg-[#191919]"
              disabled={isLoading}
            >
              <div className="flex items-center">
                <img src={metamasklogo} alt="메타마스크 로고" className="mt-2 mr-3 w-[50px]" />
                <span className="mr-1">Meta Mask</span>
              </div>
              <span className="rounded bg-[#2a2a2a] px-2 py-1 text-xs text-gray-400">
                {isMetaMaskAvailable ? '설치됨' : '설치 필요'}
              </span>
            </button>
            
            {/* 싸피 로그인 버튼 */}
            <button 
              onClick={handleSaffyLogin}
              className="mb-4 flex w-full items-center justify-between rounded-lg border border-[#222222] bg-[#111111] px-4 py-3 hover:bg-[#191919]"
              disabled={isLoading}
            >
              <div className="flex items-center">
                <img src={saffylogo} alt="싸피 로고" className="h-[40px] w-[50px]" />
                <span className="ml-2">SSAFY</span>
              </div>
              <span className="rounded bg-[#2a2a2a] px-2 py-1 text-xs text-gray-400"></span>
            </button>
          </>
        ) : (
          /* 인증 코드 입력 화면 */
          <div>
            <p className="mb-3 text-center text-sm text-gray-300">
              {email}로 12자리 인증 코드를 보냈습니다.<br />
            </p>

            <div className="mb-4 flex w-full items-center justify-between rounded-lg bg-[#222222] px-4 py-2 hover:bg-[#2a2a2a]">
              <input
                type="text"
                placeholder="인증 코드 12자리 입력"
                className="flex-grow bg-transparent text-base text-white text-center outline-none"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.slice(0, 12))}
                maxLength={12}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerifyCode();
                }}
              />
              <button 
                onClick={handleVerifyCode}
                className="flex h-[36px] w-[36px] items-center justify-center rounded bg-[#1DA1F2] cursor-pointer z-10"
                type="button"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="mb-4 flex justify-center">
              <button 
                onClick={handleBackToEmailInput} 
                className="text-sm text-gray-400 hover:text-white"
                disabled={isLoading}
              >
                다시 입력하기
              </button>
            </div>

            <div className="mb-4 flex justify-center">
              <button 
                onClick={handleSendVerificationCode} 
                className="text-sm text-blue-400 hover:text-blue-300"
                disabled={isLoading}
              >
                인증 코드 재전송
              </button>
            </div>
          </div>
        )}
        
        {/* 안내 텍스트 */}
        <p className="mt-4 text-center text-xs text-gray-400">
          지갑을 연결하고 체인툰을 사용하면 서비스 약관 및 개인정보 보호정책에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;