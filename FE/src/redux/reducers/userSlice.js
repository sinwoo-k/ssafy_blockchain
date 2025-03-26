// src/redux/reducers/userSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  walletAddress: null,
  walletType: null, // 'metamask', 'email', 'ssafy' 등
  userData: null,
  token: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
      // 로그아웃 시 모든 상태 초기화
      if (!action.payload) {
        state.walletAddress = null
        state.walletType = null
        state.userData = null
        state.token = null
      }
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload
    },
    setWalletType: (state, action) => {
      state.walletType = action.payload
    },
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.walletAddress = null
      state.walletType = null
      state.userData = null
      state.token = null
      // 토큰 제거
      localStorage.removeItem('token')
    }
  }
})

export const userReducerActions = userSlice.actions

export default userSlice.reducer