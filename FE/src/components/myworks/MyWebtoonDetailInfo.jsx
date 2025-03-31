import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWebtoon } from '../../api/webtoonAPI'
// 디폴트 이미지
import fantasyCover from '../../assets/defaultCover/fantasy.webp'
// 아이콘
import FavoriteIcon from '@mui/icons-material/Favorite'
import VisibilityIcon from '@mui/icons-material/Visibility'
import StarIcon from '@mui/icons-material/Star'
import { formattingNumber } from '../../utils/formatting'

const MyWebtoonDetailInfo = ({ webtoonId }) => {
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
        <div className='mt-24 flex gap-10'>
          {/* 웹툰 이미지 및 아이콘 정보 */}
          <div>
            {/* 웹툰 이미지 */}
            <div className='mb-3 w-[250px]'>
              <img
                src={webtoon.seroThumbnail}
                alt={`${webtoon?.title} 대표 이미지`}
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
              <p className='text-xl text-[#b9b9b9]'>{webtoon.writer}</p>
              <p className='text-xl text-[#b9b9b9]'>{webtoon.genre}</p>
              <div className='text-xl'>
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
        <div className='mt-10 flex justify-between text-black'>
          <div className='flex gap-10'>
            <Link to={`/myworks/webtoon/${webtoonId}/episode/create`}>
              <button
                className='bg-chaintoon h-[45px] w-[250px] 
              cursor-pointer rounded'
              >
                신규 회차 등록
              </button>
            </Link>
            <Link to={`/myworks/webtoon/${webtoonId}/goods`}>
              <button
                className='bg-chaintoon h-[45px] w-[250px] 
              cursor-pointer rounded'
              >
                굿즈 관리하기
              </button>
            </Link>
          </div>
          <div className='flex gap-5'>
            <Link to={`/myworks/webtoon/${webtoonId}/update`}>
              <button
                className='bg-chaintoon h-[45px] w-[150px] 
              cursor-pointer rounded'
              >
                작품 정보 수정
              </button>
            </Link>
            <button
              className='bg-chaintoon h-[45px] w-[150px] 
              cursor-pointer rounded'
            >
              작품 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyWebtoonDetailInfo
