import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteWebtoon, getWebtoon } from '../../api/webtoonAPI'
import { formattingNumber } from '../../utils/formatting'

// 디폴트 이미지
import fantasyCover from '../../assets/defaultCover/fantasy.webp'
// 아이콘
import FavoriteIcon from '@mui/icons-material/Favorite'
import VisibilityIcon from '@mui/icons-material/Visibility'
import StarIcon from '@mui/icons-material/Star'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const MyWebtoonGoodsWebtoonInfo = ({ webtoonId }) => {
  const navigate = useNavigate()
  // 배경 이미지
  const [backgroundImg, setBackgroundImg] = useState(fantasyCover)

  // 웹툰 정보
  const [webtoon, setWebtoon] = useState({})

  const getData = async () => {
    try {
      const result = await getWebtoon(webtoonId)
      setWebtoon(result)
      setBackgroundImg(result.garoThumbnail)
    } catch (error) {
      console.error('웹툰 정보 불러오기 실패: ', error)
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
        <div className='mb-10'>
          <Link
            to={'/myworks/webtoon'}
            className='text-text/75 flex items-center gap-3'
          >
            <ArrowBackIcon />
            <span className='inline-block translate-y-[1px] transform'>
              목록으로 돌아가기
            </span>
          </Link>
        </div>
        <div className='flex gap-10'>
          {/* 웹툰 이미지 및 아이콘 정보 */}
          <div>
            {/* 웹툰 이미지 */}
            <div className='mb-3 w-[250px]'>
              <img
                src={webtoon.seroThumbnail}
                alt={`${webtoon?.webtoonName} 대표 이미지`}
                className='min-h-[300px] w-[250px] rounded-xl object-cover'
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
                  key={`태그-${index}`}
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
          <Link to={`/myworks/webtoon/${webtoonId}/goods/create`}>
            <button
              className='bg-chaintoon h-[45px] w-[250px] 
            cursor-pointer rounded'
            >
              굿즈 등록하기
            </button>
          </Link>
          <Link to={`/myworks/webtoon/${webtoonId}`}>
            <button
              className='bg-chaintoon h-[45px] w-[250px] 
              cursor-pointer rounded'
            >
              웹툰 관리하기
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MyWebtoonGoodsWebtoonInfo
