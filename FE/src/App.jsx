import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import router from './router/Router';
import './App.css';
import { setupMetaMaskListeners, removeMetaMaskListeners } from './utils/metamask';
import { metaMaskLoginAction } from './redux/actions/authActions';
import { userReducerActions } from './redux/reducers/userSlice';

const { logout } = userReducerActions;

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    setupMetaMaskListeners(
      (newAccount) => {
        console.log('메타마스크 계정이 변경되었습니다:', newAccount);
        if (localStorage.getItem('authMethod') === 'metamask') {
          dispatch(metaMaskLoginAction());
        }
      },
      (chainId) => {
        console.log('메타마스크 네트워크가 변경되었습니다:', chainId);
      },
      () => {
        console.log('메타마스크 연결이 해제되었습니다');
        if (localStorage.getItem('authMethod') === 'metamask') {
          dispatch(logout());
        }
      }
    );

    if (localStorage.getItem('authMethod') === 'metamask') {
      dispatch(metaMaskLoginAction());
    }

    return () => {
      removeMetaMaskListeners();
    };
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
