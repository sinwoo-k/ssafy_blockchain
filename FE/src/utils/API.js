import axios from 'axios'

const API = axios.create({
  baseURL: `${import.meta.env.VITE_CHAINTOON_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default API
