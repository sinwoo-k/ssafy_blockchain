import React, { useEffect, useState } from 'react'
import LogoImg from '../../assets/logo1.png'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const NavBar = () => {
  // 로그인 확인
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  // 스크롤 감지
  const [scroll, setScroll] = useState(false)

  useEffect(() => {
    // mount
    window.addEventListener('scroll', handleScroll)

    // unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScroll = () => {
    // 스크롤이 Top에서 50px 이상 내려오면 true
    if (window.scrollY >= 50) {
      setScroll(true)
    } else {
      // 스크롤이 50px 미만일경우 false
      setScroll(false)
    }
  }
  return (
    <div
      className={`border-text text-text ${scroll && 'bg-black'} 
      fixed top-0 z-10 flex h-[80px] w-full justify-between border-b`}
    >
      <div className='flex'>
        {/* 로고 */}
        <div className='flex w-[250px] items-center justify-center'>
          <Link to={'/'}>
            <img src={LogoImg} alt='체인툰 로고' className='w-[200px]' />
          </Link>
        </div>
        {/* 페이지 내비게이션*/}
        <div className='flex h-full w-[150px] items-center justify-center'>
          <Link className='text-xl'>웹툰</Link>
        </div>
        <div className='flex h-full w-[150px] items-center justify-center'>
          <Link className='text-xl'>스토어</Link>
        </div>
        <div className='flex h-full w-[150px] items-center justify-center'>
          <Link className='text-xl'>팬아트</Link>
        </div>
      </div>
      {/* 회원 관련 */}
      <div className='flex'>
        {isAuthenticated && (
          <div className='flex h-full w-[150px] items-center justify-center'>
            <Link className='text-xl'>마이페이지</Link>
          </div>
        )}
        {isAuthenticated && (
          <div className='flex h-full w-[150px] items-center justify-center'>
            <button className='cursor-pointer text-xl'>로그아웃</button>
          </div>
        )}
        {!isAuthenticated && (
          <div className='flex h-full w-[150px] items-center justify-center'>
            <button className='cursor-pointer text-xl'>로그인</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar
