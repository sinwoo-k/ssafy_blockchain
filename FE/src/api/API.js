import axios from 'axios'

const BASE_URL = import.meta.env.VITE_CHAINTOON_BASE_URL
console.log('API Base URL:', BASE_URL) // 디버깅용

const API = axios.create({
  baseURL: BASE_URL,  // 템플릿 리터럴 ${} 제거 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default API