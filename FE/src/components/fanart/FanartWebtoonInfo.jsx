import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getWebtoon } from '../../api/webtoonAPI'
import { formattingNumber } from '../../utils/formatting'

// 디폴트 이미지
import fantasyCover from '../../assets/defaultCover/fantasy.webp'
// 아이콘
import FavoriteIcon from '@mui/icons-material/Favorite'
import VisibilityIcon from '@mui/icons-material/Visibility'
import StarIcon from '@mui/icons-material/Star'

const FanartWebtoonInfo = ({ webtoonId }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const userData = useSelector((state) => state.user.userData)

  // 배경 이미지
  const [backgroundImg, setBackgroundImg] = useState(fantasyCover)

  // 웹툰 정보
  const [webtoon, setWebtoon] = useState({})

  const getData = async () => {
    try {
      const result = await getWebtoon(webtoonId)
      console.log(result)
      setWebtoon(result)
      setBackgroundImg(result.garoThumbnail)
    } catch (error) {
      console.error('웹툰 조회 실패: ', error)
    }
  }

  const handleCreateButton = (event) => {
    if (!isAuthenticated) {
      event.preventDefault()
      alert('로그인이 필요합니다.')
      return
    }
    if (userData.id === webtoon.userId) {
      event.preventDefault()
      alert('원작자는 팬아트를 등록할 수 없습니다.')
      return
    }
  }

  useEffect(() => {
    // mount
    getData()
    // unmount
    return () => {}
  }, [])
  return (
    <div className={`relative mb-10 flex w-full justify-center py-10`}>
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: `url(${backgroundImg})`,
          filter: 'blur(35px) brightness(0.5)',
        }}
      ></div>
      <div className='relative w-[1000px]'>
        <div className='mt-24 flex gap-10'>
          {/* 웹툰 이미지 및 아이콘 정보 */}
          <div>
            {/* 웹툰 이미지 */}
            <div className='mb-3 w-[250px]'>
              <img
                src={webtoon.seroThumbnail}
                alt={`${webtoon?.webtoonName} 대표 이미지`}
                className='h-[300px] w-[250px] rounded-xl'
              />
            </div>
            {/* 웹툰 정보 관련 아이콘 */}
            <div className='flex items-center justify-evenly'>
              <div className='flex items-center gap-1'>
                <FavoriteIcon sx={{ fontSize: 25, color: '#ff1919' }} />
                <span className='inline-block w-[45px] translate-y-[1px] transform'>
                  {formattingNumber(webtoon.favoriteCount)}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <VisibilityIcon sx={{ fontSize: 30, color: '#3cc3ec' }} />
                <span className='inline-block w-[45px] translate-y-[1px] transform'>
                  {formattingNumber(webtoon.viewCount)}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <StarIcon sx={{ fontSize: 25, color: '#ffff19' }} />
                <span className='inline-block w-[45px] translate-y-[1px] transform'>
                  {(webtoon.rating / 2).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {/* 웹툰 정보 */}
          <div className='flex flex-col justify-between'>
            <div className='flex flex-col gap-5'>
              <p className='text-2xl'>{webtoon.webtoonName}</p>
              <p className='text-lg text-[#b9b9b9]'>{webtoon.writer}</p>
              <p className='text-lg text-[#b9b9b9]'>{webtoon.genre}</p>
              <div className=''>
                {webtoon.summary?.split('\n').map((line, index) => (
                  <p key={`summary-${index}`}>{line}</p>
                ))}
              </div>
            </div>
            {/* 태그 */}
            <div className='flex flex-wrap gap-3'>
              {webtoon.tags?.map((tag, index) => (
                <div
                  key={`${webtoon.webtoonName}-태그${index + 1}`}
                  className='bg-chaintoon/75 rounded px-2 py-1'
                >
                  # {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 버튼 */}
        <div className='mt-10 flex gap-10 text-black'>
          <Link
            to={`/fanart/webtoon/${webtoonId}/create`}
            onClick={handleCreateButton}
          >
            <button
              className='bg-chaintoon h-[45px] w-[250px] 
            cursor-pointer rounded'
            >
              팬아트 올리기
            </button>
          </Link>
          <Link to={`/webtoon/${webtoonId}`}>
            <button
              className='bg-chaintoon h-[45px] w-[250px] 
              cursor-pointer rounded'
            >
              웹툰 보러가기
            </button>
          </Link>
          <Link>
            <button
              className='bg-chaintoon h-[45px] w-[250px] 
              cursor-pointer rounded'
            >
              스토어 바로가기
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FanartWebtoonInfo
