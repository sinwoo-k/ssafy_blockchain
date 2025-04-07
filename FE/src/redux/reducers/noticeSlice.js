import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userId: null,
  uncheckedNoticeCount: 0,
  noticeList: [],
}

export const noticeSlice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    setNotice: (state, action) => {
      return action.payload
    },
  },
})

export const noticeReducerActions = noticeSlice.actions

export default noticeSlice.reducer
