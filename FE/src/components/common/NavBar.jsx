import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { userReducerActions } from '../../redux/reducers/userSlice'
// 컴포넌트
import LoginModal from '../Auth/LoginModal'

// 이미지
import LogoImg from '../../assets/logo1.png'

// 아이콘
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import IconLink from './IconLink'

const NavBar = () => {
  // 로그인 확인
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const dispatch = useDispatch()

  // 로그인 모달 상태
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

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
    if (window.scrollY !== 0) {
      setScroll(true)
    } else {
      setScroll(false)
    }
  }

  const handleLogout = () => {
    dispatch(userReducerActions.logout())
  }

  return (
    <>
      <div
        className={`border-text text-text ${scroll && 'bg-black'} 
      fixed top-0 z-10 flex h-[60px] w-full justify-between border-b`}
      >
        <div className='flex'>
          {/* 로고 */}
          <div className='flex w-[200px] items-center justify-center'>
            <Link to={'/'}>
              <img src={LogoImg} alt='체인툰 로고' className='w-[150px]' />
            </Link>
          </div>
          {/* 페이지 내비게이션*/}
          <div className='flex h-full w-[100px] items-center justify-center'>
            <Link className='text-lg'>웹툰</Link>
          </div>
          <div className='flex h-full w-[100px] items-center justify-center'>
            <Link to='/store' className='text-lg'>
              스토어
            </Link>
          </div>
          <div className='flex h-full w-[100px] items-center justify-center'>
            <Link to={'/fanart'} className='text-lg'>
              팬아트
            </Link>
          </div>
        </div>
        {/* 회원 관련 */}
        <div className='flex'>
          {isAuthenticated && (
            <div className='flex h-full w-[100px] items-center justify-center gap-5'>
              <IconLink
                path={'/'}
                Icon={CollectionsBookmarkIcon}
                tooltip={'관심 웹툰'}
              />
              <IconLink
                path={'/myworks/webtoon'}
                Icon={LocalLibraryIcon}
                tooltip={'내 작품 목록'}
              />
            </div>
          )}
          {isAuthenticated && (
            <div className='flex h-full w-[100px] items-center justify-center'>
              <Link to='/mypage' className='text-lg'>
                마이페이지
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <div className='flex h-full w-[100px] items-center justify-center'>
              <button className='cursor-pointer text-lg' onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          )}
          {!isAuthenticated && (
            <div className='flex h-full w-[100px] items-center justify-center'>
              <button
                className='cursor-pointer text-lg'
                onClick={() => setIsLoginModalOpen(true)}
              >
                로그인
              </button>
            </div>
          )}
        </div>
      </div>
      {/* 로그인 모달 추가 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}

export default NavBar
