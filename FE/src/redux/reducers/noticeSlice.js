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
    addNotices: (state, action) => {
      state.noticeList = [...state.noticeList, ...action.payload.noticeList]
      state.uncheckedNoticeCount = action.payload.uncheckedNoticeCount
    },
    markNoticeRead: (state, action) => {
      const noticeId = action.payload
      state.noticeList = state.noticeList.map((notice) =>
        notice.noticeId === noticeId ? { ...notice, checked: 'Y' } : notice,
      )
      if (state.uncheckedNoticeCount > 0) state.uncheckedNoticeCount--
    },
    removeNotice: (state, action) => {
      const noticeId = action.payload
      const removed = state.noticeList.find(
        (notice) => notice.noticeId === noticeId,
      )
      state.noticeList = state.noticeList.filter(
        (notice) => notice.noticeId !== noticeId,
      )
      if (
        removed &&
        removed.checked === 'N' &&
        state.uncheckedNoticeCount > 0
      ) {
        state.uncheckedNoticeCount--
      }
    },
  },
})

export const noticeReducerActions = noticeSlice.actions

export default noticeSlice.reducer
