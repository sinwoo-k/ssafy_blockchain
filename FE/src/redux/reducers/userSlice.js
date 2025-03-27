// userSlice.js (최종 최적화 코드)
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  walletAddress: null,
  walletType: null,
  userData: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.walletAddress = null;
        state.walletType = null;
        state.userData = null;
      }
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setWalletType: (state, action) => {
      state.walletType = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUser:(state,action) =>{
      state.userData = action.payload;
    },
    logout: () => initialState,
  },
});

export const userReducerActions = userSlice.actions;

export default userSlice.reducer;