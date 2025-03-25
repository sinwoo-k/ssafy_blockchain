// redux/reducers/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loginStep: 0, // 0: 이메일 입력, 1: 인증 코드 입력
  email: '',
  isLoading: false,
  errorMessage: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginStep: (state, action) => {
      state.loginStep = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    resetAuthState: (state) => {
      return initialState;
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;