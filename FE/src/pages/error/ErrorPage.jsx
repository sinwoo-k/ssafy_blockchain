import React from 'react'
import { Link, useLocation } from 'react-router-dom'

// 이미지
import logoImg from '../../assets/logo1.png'

// 아이콘
import HomeIcon from '@mui/icons-material/Home'

const ErrorPage = () => {
  const location = useLocation()
  const errorMessage =
    location.state?.message || '알 수 없는 에러가 발생했습니다.'
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center'>
      <div className='mb-15  flex flex-col items-center justify-center gap-10'>
        <div>
          <img src={logoImg} alt='체인툰 로고 이미지' className='w-[300px]' />
        </div>
        <p className='text-lg'>{errorMessage}</p>
        <Link
          to={'/'}
          className='text-chaintoon flex items-center gap-1 text-lg'
        >
          <HomeIcon sx={{ fontSize: 30 }} />
          홈으로 이동하기
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage
