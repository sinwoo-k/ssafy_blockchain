import React, { useEffect, useState } from 'react'
import WebtoonCard from './WebtoonCard'
// carousel
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
// 디폴트 이미지
import fantasyCover from '../../assets/defaultCover/fantasy.webp'
import actionCover from '../../assets/defaultCover/action.webp'
import romanceCover from '../../assets/defaultCover/romance.webp'
import dramaCover from '../../assets/defaultCover/drama.webp'
import historyCover from '../../assets/defaultCover/history.webp'

const TodayRecommend = () => {
  // 배경 이미지
  const [backgroundImg, setBackgroundImg] = useState(fantasyCover)
  // 추천 웹툰 리스트
  const [webtoons, setWebtoons] = useState([])

  // carousel setting
  const setting = {
    dots: false,
    Infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (current, next) => {
      setBackgroundImg(webtoons[next]?.seroThumbnail)
    },
    draggable: false,
  }
  useEffect(() => {
    setWebtoons([
      {
        webtoonId: 0,
        webtoonName: '판타지',
        genre: 'fantasy',
        seroThumbnail: fantasyCover,
      },
      {
        webtoonId: 1,
        webtoonName: '액션',
        genre: 'action',
        seroThumbnail: actionCover,
      },
      {
        webtoonId: 2,
        webtoonName: '로맨스',
        genre: 'romance',
        seroThumbnail: romanceCover,
      },
      {
        webtoonId: 3,
        webtoonName: '드라마',
        genre: 'drama',
        seroThumbnail: dramaCover,
      },
      {
        webtoonId: 4,
        webtoonName: '무협/사극',
        genre: 'history',
        seroThumbnail: historyCover,
      },
    ])
  }, [])
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
        <h1 className='mt-24 mb-5 text-xl'>오늘의 추천 웹툰</h1>
        <div>
          <Slider {...setting}>
            {webtoons.map((webtoon) => (
              <WebtoonCard key={webtoon.webtoonId} webtoon={webtoon} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  )
}

export default TodayRecommend
