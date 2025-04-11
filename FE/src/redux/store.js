import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'
import userReducer from './reducers/userSlice'
import searchReducer from './reducers/searchSlice'
import noticeReducer from './reducers/noticeSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    search: searchReducer,
    notice: noticeReducer,
  },
  // DevTools 확장 프로그램 연결
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
