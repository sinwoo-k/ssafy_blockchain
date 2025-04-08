import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { userReducerActions } from '../../redux/reducers/userSlice'
import { logoutAction } from '../../redux/actions/authActions'
import { getRandomColor } from '../../utils/randomColor'

// 컴포넌트
import LoginModal from '../Auth/LoginModal'
import IconLink from './IconLink'
import IconButton from './IconButton'
import GlobalSearchBar from '../search/GlobalSearchBar'

// 이미지
import LogoImg from '../../assets/logo1.png'

// 아이콘
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MyNotice from './MyNotice'

const NavBar = () => {
  // 로그인 확인
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const userData = useSelector((state) => state.user.userData)
  const dispatch = useDispatch()

  // 프로필 랜덤 컬러
  const [randomColor, setRandomColor] = useState(getRandomColor())

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
    dispatch(logoutAction())
  }

  const userProfileImage = () => {
    return (
      <div>
        <img
          src={userData.profileImage}
          alt='유저 프로필 이미지'
          className='h-[32px] w-[32px] rounded-full'
        />
      </div>
    )
  }

  return (
    <>
      <div
        className={`border-text text-text ${scroll && 'bg-black'} 
      fixed top-0 z-20 flex h-[60px] w-full justify-between border-b`}
      >
        <div className='flex'>
          {/* 로고 */}
          <div className='flex items-center justify-center px-5'>
            <Link to={'/'}>
              <img src={LogoImg} alt='체인툰 로고' className='w-[150px]' />
            </Link>
          </div>
          {/* 페이지 내비게이션*/}
          <div className='flex h-full w-[80px] items-center justify-center'>
            <Link
              to={'/'}
              className='hover:text-chaintoon text-lg hover:text-xl'
            >
              웹툰
            </Link>
          </div>
          <div className='flex h-full w-[80px] items-center justify-center'>
            <Link
              to='/store'
              className='hover:text-chaintoon text-lg hover:text-xl'
            >
              스토어
            </Link>
          </div>
          <div className='flex h-full w-[80px] items-center justify-center'>
            <Link
              to={'/fanart'}
              className='hover:text-chaintoon text-lg hover:text-xl'
            >
              팬아트
            </Link>
          </div>
        </div>
        <div className='flex h-full items-center gap-8'>
          <GlobalSearchBar />
          {/* 회원 관련 */}
          {isAuthenticated && (
            <div className='flex h-full items-center justify-center gap-5 pe-5'>
              <div className='hover:text-chaintoon'>
                <IconLink
                  path={'/webtoon/myfavorite'}
                  Icon={CollectionsBookmarkIcon}
                  tooltip={'관심 웹툰'}
                  style={{ fontSize: 28 }}
                />
              </div>
              <div className='hover:text-chaintoon'>
                <IconLink
                  path={'/myworks/webtoon'}
                  Icon={LocalLibraryIcon}
                  tooltip={'내 작품 목록'}
                  style={{ fontSize: 28 }}
                />
              </div>
              <div>
                <MyNotice />
              </div>
              <div className='hover:text-chaintoon'>
                <IconLink
                  path={'/mypage'}
                  Icon={
                    userData.profileImage === ''
                      ? AccountCircleIcon
                      : userProfileImage
                  }
                  tooltip={`${userData.nickname}님`}
                  style={{ fontSize: 32, color: randomColor }}
                />
              </div>
              <div className='hover:text-chaintoon' onClick={handleLogout}>
                <IconButton
                  Icon={LogoutIcon}
                  tooltip={'로그아웃'}
                  style={{ fontSize: 28 }}
                />
              </div>
            </div>
          )}
          {!isAuthenticated && (
            <div className='flex h-full items-center justify-center pe-5'>
              <div
                className='hover:text-chaintoon'
                onClick={() => setIsLoginModalOpen(true)}
              >
                <IconButton
                  Icon={LoginIcon}
                  tooltip={'로그인'}
                  style={{ fontSize: 30 }}
                />
              </div>
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
