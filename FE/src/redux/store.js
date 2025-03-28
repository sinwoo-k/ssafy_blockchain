import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import userReducer from './reducers/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
  // DevTools 확장 프로그램 연결
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;