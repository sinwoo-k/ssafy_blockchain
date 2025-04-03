// searchSlice.js (최종 최적화 코드)
import { createSlice } from '@reduxjs/toolkit'

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    keyword: '',
    webtoons: [],
    users: [],
    fanarts: [],
    goods: [],
  },
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload
    },
    setWebtoons: (state, action) => {
      state.webtoons = action.payload
    },
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setFanarts: (state, action) => {
      state.fanarts = action.payload
    },
    setGoods: (state, action) => {
      state.goods = action.payload
    },
  },
})

export const searchReducerActions = searchSlice.actions

export default searchSlice.reducer
