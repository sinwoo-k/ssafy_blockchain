// App.jsx
import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import router from './router/Router';
import './App.css';
import { setupMetaMaskListeners, removeMetaMaskListeners } from './utils/metamask';
import { metaMaskLoginAction, fetchMyUserInfo } from './redux/actions/authActions';
import { userReducerActions } from './redux/reducers/userSlice';
import { connect } from './utils/socket/stompClient';

const { logout } = userReducerActions;

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1️⃣ 메타마스크 이벤트 등록
    setupMetaMaskListeners(
      (newAccount) => {
        if (localStorage.getItem('authMethod') === 'metamask') {
          dispatch(metaMaskLoginAction());
        }
      },
      null,
      () => {
        if (localStorage.getItem('authMethod') === 'metamask') {
          dispatch(logout());
        }
      }
    );

    // 2️⃣ 메타마스크 로그인 상태 유지
    if (localStorage.getItem('authMethod') === 'metamask') {
      dispatch(metaMaskLoginAction());
    }

    // 3️⃣ JWT 쿠키로 로그인 상태 유지 (fetchMyUserInfo는 한 번만 호출됨)
    dispatch(fetchMyUserInfo())
    .then((data) => {
      console.log('✅ 내 정보 로딩 성공:', data);
      if (data) {
        console.log('사용자 ID:', data.id);
        console.log('사용자 이메일:', data.email);
      }
      
      // 소켓 연결
      connect(data.id, (message) => {
        // TODO: 새로운 알림 도착 시 알림 목록 조회 로직 추가
        console.log(message)
      });
      
    })
    .catch((err) => {
      console.error('🚨 내 정보 로딩 실패:', err);
      dispatch(userReducerActions.logout());
    });

    // 4️⃣ 리스너 제거
    return () => {
      removeMetaMaskListeners();
    };
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
