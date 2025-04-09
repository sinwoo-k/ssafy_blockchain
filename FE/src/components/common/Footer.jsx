import React from 'react'

// 이미지
import LogoImg from '../../assets/logo1.png'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='mt-20 w-full bg-neutral-800 px-10 py-5 text-white'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-4 text-center md:mb-0 md:text-left'>
          <div>
            <img src={LogoImg} alt='체인툰 로고' className='w-[200px]' />
          </div>
          <p className='mt-2'>
            디지털 웹툰의 새로운 패러다임 - NFT로 소유하고, 즐기세요!
          </p>
        </div>
        <div className='mt-5 flex gap-5'>
          <Link to={`/policy/terms`}>이용약관</Link>
          <Link to={`/policy/privacy`}>개인정보처리방침</Link>
        </div>
        <p className='text-text/75'>
          본 사이트의 콘텐츠는 저작권법의 보호를 받는 바 무단 전재, 복사, 배포
          등을 금합니다.
        </p>
        <div className='mt-4 text-sm'>
          <p>© 2025 Chaintoon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
