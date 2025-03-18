import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
    }
  },
})

export const userReducerActions = userSlice.actions
export default userSlice.reducer