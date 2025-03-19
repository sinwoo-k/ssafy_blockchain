import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// 디폴트 이미지
import fantasyCover from '../../assets/defaultCover/fantasy.webp'
// 아이콘
import FavoriteIcon from '@mui/icons-material/Favorite'
import VisibilityIcon from '@mui/icons-material/Visibility'
import StarIcon from '@mui/icons-material/Star'

const WebtoonDetailInfo = () => {
  // 배경 이미지
  const [backgroundImg, setBackgroundImg] = useState(fantasyCover)

  // 웹툰 정보
  const [webtoon, setWebtoon] = useState({})

  // 웹툰 태그
  const [tags, setTags] = useState([])

  useEffect(() => {
    // mount
    setWebtoon({
      id: 0,
      title: '판타지',
      author: '작가1',
      genre: '판타지',
      summary:
        '판타지 웹툰의 줄거리입니다.\n테스트를 위한 줄거리 데이터 입니다. ',
      cover: fantasyCover,
    })
    setTags([
      { id: 0, tagName: '판타지' },
      { id: 1, tagName: '마법사' },
      { id: 2, tagName: '먼치킨' },
      { id: 3, tagName: '모험' },
      { id: 4, tagName: '태그1' },
      { id: 5, tagName: '태그2' },
      { id: 6, tagName: '태그3' },
      { id: 7, tagName: '태그4' },
      { id: 8, tagName: '태그5' },
      { id: 9, tagName: '태그6' },
    ])
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
            <div className='mb-3'>
              <img
                src={fantasyCover}
                alt={`${webtoon?.title} 대표 이미지`}
                className='h-[300px] w-[250px] rounded-xl'
              />
            </div>
            {/* 웹툰 정보 관련 아이콘 */}
            <div className='flex items-center justify-evenly'>
              <div className='flex items-center gap-1'>
                <FavoriteIcon sx={{ fontSize: 25, color: '#ff1919' }} />
                <span className='inline-block w-[45px] translate-y-[1px] transform'>
                  109
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <VisibilityIcon sx={{ fontSize: 30, color: '#3cc3ec' }} />
                <span className='inline-block w-[45px] translate-y-[1px] transform'>
                  109K
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <StarIcon sx={{ fontSize: 25, color: '#ffff19' }} />
                <span className='inline-block w-[45px] translate-y-[1px] transform'>
                  4.56
                </span>
              </div>
            </div>
          </div>
          {/* 웹툰 정보 */}
          <div className='flex flex-col justify-between'>
            <div className='flex flex-col gap-5'>
              <p className='text-2xl'>{webtoon.title}</p>
              <p className='text-xl text-[#b9b9b9]'>{webtoon.author}</p>
              <p className='text-xl text-[#b9b9b9]'>{webtoon.genre}</p>
              <div className='text-xl'>
                {webtoon.summary?.split('\n').map((line, index) => (
                  <p key={`summary-${index}`}>{line}</p>
                ))}
              </div>
            </div>
            {/* 태그 */}
            <div className='flex flex-wrap gap-3'>
              {tags.map((tag) => (
                <div key={tag.id} className='bg-chaintoon/75 rounded px-2 py-1'>
                  #{tag.tagName}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 버튼 */}
        <div className='mt-10 flex gap-10'>
          <button
            className='bg-chaintoon h-[45px] w-[250px] 
            cursor-pointer rounded text-lg'
          >
            관심 웹툰 등록
          </button>
          <Link>
            <button
              className='bg-chaintoon h-[45px] w-[250px] 
              cursor-pointer rounded text-lg'
            >
              팬아트 보러가기
            </button>
          </Link>
          <Link>
            <button
              className='bg-chaintoon h-[45px] w-[250px] 
              cursor-pointer rounded text-lg'
            >
              스토어 바로가기
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WebtoonDetailInfo
