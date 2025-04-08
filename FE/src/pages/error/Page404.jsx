import React from 'react'
import { Link } from 'react-router-dom'

// 이미지
import logoImg from '../../assets/logo1.png'

// 아이콘
import HomeIcon from '@mui/icons-material/Home'

const Page404 = () => {
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center gap-10'>
      <div>
        <img src={logoImg} alt='체인툰 로고 이미지' className='w-[300px]' />
      </div>
      <p className='text-lg'>잘못된 접근입니다. 주소를 확인해주세요.</p>
      <Link to={'/'} className='text-chaintoon flex items-center gap-1 text-lg'>
        <HomeIcon sx={{ fontSize: 30 }} />
        홈으로 이동하기
      </Link>
    </div>
  )
}

export default Page404
