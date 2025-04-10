import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formattingNumber } from '../../utils/formatting'

// 디폴트 이미지
import fantasyCover from '../../assets/defaultCover/fantasy.webp'
// 아이콘
import FavoriteIcon from '@mui/icons-material/Favorite'
import VisibilityIcon from '@mui/icons-material/Visibility'
import StarIcon from '@mui/icons-material/Star'
import {
  createFavoriteWebtoon,
  deleteFavoriteWebtoon,
} from '../../api/webtoonAPI'

const WebtoonDetailInfo = ({ webtoon, patchData }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  // 배경 이미지
  const [backgroundImg, setBackgroundImg] = useState(fantasyCover)
  const [favorites, setFavorites] = useState([])
  const [isFavorite, setIsFavorite] = useState(false) // 관심 웹툰 여부

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.')
      return
    }
    if (isFavorite) {
      try {
        const result = await deleteFavoriteWebtoon(webtoon.webtoonId)
        patchData()
      } catch (error) {
        console.error('관심 웹툰 취소 실패: ', error)
      }
    } else {
      try {
        const result = await createFavoriteWebtoon(webtoon.webtoonId)
        patchData()
      } catch (error) {
        console.error('관심 웹툰 등록 실패: ', error)
      }
    }
  }

  useEffect(() => {
    // mount
    setBackgroundImg(webtoon.garoThumbnail)
    setIsFavorite(webtoon.hasFavorited === 'Y' ? true : false)
    // unmount
    return () => {}
  }, [webtoon])

  return (
    <div className={`relative mb-10 flex w-full justify-center py-10`}>
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: `url(${backgroundImg})`,
          filter: 'blur(15px) brightness(0.5)',
        }}
      ></div>
      <div className='relative w-[1000px]'>
        <div className='mt-24 flex gap-10'>
          {/* 웹툰 이미지 및 아이콘 정보 */}
          <div>
            {/* 웹툰 이미지 */}
            <div className='mb-3 w-[250px]'>
              <img
                src={webtoon?.seroThumbnail}
                alt={`${webtoon?.webtoonName} 대표 이미지`}
                className='min-h-[300px] w-[250px] rounded-xl object-cover'
                onError={(event) => (event.target.src = fantasyCover)}
              />
            </div>
            {/* 웹툰 정보 관련 아이콘 */}
            <div className='grid grid-cols-3 gap-2'>
              <div className='flex items-center gap-1'>
                <FavoriteIcon sx={{ fontSize: 25, color: '#ff1919' }} />
                <span className='inline-block  translate-y-[1px] transform'>
                  {formattingNumber(webtoon.favoriteCount)}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <VisibilityIcon sx={{ fontSize: 30, color: '#3cc3ec' }} />
                <span className='inline-block translate-y-[1px] transform'>
                  {formattingNumber(webtoon.viewCount)}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <StarIcon sx={{ fontSize: 25, color: '#ffff19' }} />
                <span className='inline-block  translate-y-[1px] transform'>
                  {(webtoon.rating / 2).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {/* 웹툰 정보 */}
          <div className='flex flex-col justify-between'>
            <div className='flex flex-col gap-5'>
              <p className='text-2xl break-words'>{webtoon?.webtoonName}</p>
              <Link to={`/user/${webtoon.userId}`}>
                <p className='text-text/75 hover:text-chaintoon text-lg hover:underline'>
                  {webtoon?.writer}
                </p>
              </Link>
              <p className='text-text/75 text-lg'>{webtoon?.genre}</p>
              <div className=''>
                {webtoon?.summary?.split('\n').map((line, index) => (
                  <p key={`summary-${index}`}>{line}</p>
                ))}
              </div>
            </div>
            {/* 태그 */}
            <div className='flex flex-wrap gap-3'>
              {webtoon.tags?.length === 0 ? (
                <div className='text-text/50'>등록된 태그가 없습니다.</div>
              ) : (
                webtoon.tags?.map((tag, index) => (
                  <div
                    key={`${webtoon.webtoonName}-태그${index + 1}`}
                    className='bg-chaintoon/75 rounded px-2 py-1'
                  >
                    # {tag}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {/* 버튼 */}
        <div className='mt-10 flex gap-10 text-black'>
          <button
            className='bg-chaintoon h-[45px] w-[250px] 
            cursor-pointer rounded'
            onClick={toggleFavorite}
          >
            {isFavorite ? '관심 웹툰 취소' : '관심 웹툰 등록'}
          </button>
          <Link to={`/store/collection/${webtoon.webtoonId}`}>
            <button
              className='bg-chaintoon h-[45px] w-[250px] 
              cursor-pointer rounded'
            >
              스토어 바로가기
            </button>
          </Link>
          {webtoon.adaptable === 'Y' && (
            <Link to={`/fanart/webtoon/${webtoon.webtoonId}`}>
              <button
                className='bg-chaintoon h-[45px] w-[250px] 
              cursor-pointer rounded'
              >
                팬아트 보러가기
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default WebtoonDetailInfo
