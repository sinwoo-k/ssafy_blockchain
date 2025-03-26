// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
import authReducer from './reducers/authSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    // 다른 리듀서들...
  }
});

export default store;