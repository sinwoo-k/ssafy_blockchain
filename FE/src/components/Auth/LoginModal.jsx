import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../redux/reducers/authSlice';
import { userReducerActions } from '../../redux/reducers/userSlice';
import { requestEmailVerification, verifyEmailCode } from '../../redux/actions/authActions';
import LogoImg from '../../assets/logo2.png';
import saffylogo from '../../assets/ssafylogo.png';
import metamasklogo from '../../assets/metamask_logo.png';

const LoginModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  
  // Redux 상태 가져오기
  const { loginStep, isLoading, errorMessage } = useSelector(state => state.auth);
  const { isAuthenticated } = useSelector(state => state.user);
  
  // 이메일 상태는 Redux와 로컬에서 모두 관리
  // Redux에서는 API 호출을 위해, 로컬에서는 입력 필드 제어를 위해 사용
  const { email: reduxEmail } = useSelector(state => state.auth);
  const [email, setEmail] = useState('');
  
  // 인증 코드는 로컬 상태로 관리 (일회성 입력값이므로)
  const [inputCode, setInputCode] = useState('');
  
  // 컴포넌트 마운트 시 Redux 이메일 상태를 로컬 상태에 동기화
  useEffect(() => {
    if (reduxEmail) {
      setEmail(reduxEmail);
    }
  }, [reduxEmail]);
  
  // 인증 상태 변경 감지 - 로그인 성공 시 모달 닫기
  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);
  
  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      // Redux 인증 상태 초기화
      dispatch(authActions.resetAuthState());
      // 로컬 상태 초기화
      setInputCode('');
      setEmail('');
    }
  }, [isOpen, dispatch]);
  
  // 이메일 입력 처리
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Redux 상태도 업데이트 (선택적)
    dispatch(authActions.setEmail(e.target.value));
  };
  
  // 이메일 인증 코드 요청
  const handleSendVerificationCode = () => {
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(authActions.setErrorMessage('유효한 이메일 주소를 입력해주세요'));
      return;
    }

    // Redux 액션 디스패치
    dispatch(requestEmailVerification(email));
  };

  // 인증 코드 확인
  const handleVerifyCode = async () => {
    // 코드가 12자리인지 확인
    if (inputCode.length !== 12) {
      dispatch(authActions.setErrorMessage('12자리 인증 코드를 입력해주세요'));
      return;
    }
    
    // Redux 액션 디스패치
    const result = await dispatch(verifyEmailCode(email, inputCode));
    
    // 성공 시 모달 닫기 (이미 useEffect에서 처리될 수 있음)
    if (result && result.payload && !result.error) {
      onClose();
    }
  };

  // 메타마스크 로그인
  const handleMetaMaskLogin = () => {
    // 실제 메타마스크 연동 로직은 별도 구현 필요
    // 임시로 바로 로그인 성공 처리
    dispatch(userReducerActions.setAuthenticated(true));
    onClose();
  };

  // 싸피 로그인
  const handleSaffyLogin = () => {
    // 실제 싸피 연동 로직은 별도 구현 필요
    // 임시로 바로 로그인 성공 처리
    dispatch(userReducerActions.setAuthenticated(true));
    onClose();
  };

  // 이메일 입력 단계로 돌아가기
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
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendVerificationCode();
                }}
                disabled={isLoading}
              />
              <button 
                onClick={handleSendVerificationCode}
                className="flex h-[36px] w-[36px] items-center justify-center rounded bg-[#1DA1F2]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
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
                <img src={metamasklogo} alt="메타마스크 로고" className="w-[50px]" />
                <span className="ml-2">Meta Mask</span>
              </div>
              <span className="rounded bg-[#2a2a2a] px-2 py-1 text-xs text-gray-400">설치됨</span>
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
              {email} 로 인증 코드를 보냈습니다.<br />
            </p>

            <div className="mb-4 flex w-full items-center justify-between rounded-lg bg-[#222222] px-4 py-2 hover:bg-[#2a2a2a]">
              <input
                type="text"
                placeholder="인증 코드 입력"
                className="flex-grow bg-transparent text-base text-white text-center outline-none"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.slice(0,12))}
                maxLength={12}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerifyCode();
                }}
                disabled={isLoading}
              />
              <button 
                onClick={handleVerifyCode}
                className="flex h-[36px] w-[36px] items-center justify-center rounded bg-[#1DA1F2] cursor-pointer z-10"
                type="button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>

            <div className="mb-4 flex justify-center">
              <button 
                onClick={() => setLoginStep(0)} 
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
  )
}

export default LoginModal