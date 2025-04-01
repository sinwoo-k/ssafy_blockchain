import axios from 'axios'

const BASE_URL = import.meta.env.VITE_CHAINTOON_BASE_URL

const API = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 자동 전송 필수 설정!
})

export default API
