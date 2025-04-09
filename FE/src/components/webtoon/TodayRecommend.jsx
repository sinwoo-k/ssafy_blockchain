import React, { useEffect, useState } from 'react'
import WebtoonCard from './WebtoonCard'
import RecommendWebtoonCard from './RecommendWebtoonCard'
import { getWebtoonList } from '../../api/webtoonAPI'
// carousel
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useNavigate } from 'react-router-dom'

const TodayRecommend = () => {
  const navigate = useNavigate()

  // 배경 이미지
  const [backgroundImg, setBackgroundImg] = useState()
  // 추천 웹툰 리스트
  const [webtoons, setWebtoons] = useState([])

  const getData = async () => {
    try {
      const result = await getWebtoonList(1, 50)

      // viewCount의 최대값 계산
      const maxViewCount = Math.max(...result.map((item) => item.viewCount))
      const VIEW_WEIGHT = 1

      const data = result
        .map((webtoon) => ({
          ...webtoon,
          normalizedViewCount: maxViewCount
            ? webtoon.viewCount / maxViewCount
            : 0,
          compositeScore:
            webtoon.rating + (webtoon.viewCount / maxViewCount) * VIEW_WEIGHT,
        }))
        .sort((a, b) => b.compositeScore - a.compositeScore)
        .slice(0, 7)

      setWebtoons(data)
      setBackgroundImg(data[0].garoThumbnail)
    } catch (error) {
      navigate('/error', { state: { message: error.response.data.message } })
      console.error('웹툰 조회 실패: ', error)
    }
  }

  // carousel setting
  const setting = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (current, next) => {
      setBackgroundImg(webtoons[next]?.garoThumbnail)
    },
    draggable: false,
  }
  useEffect(() => {
    getData()
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
        <div className='px-5'>
          <Slider {...setting}>
            {webtoons.map((webtoon) => (
              // <WebtoonCard key={webtoon.webtoonId} webtoon={webtoon} />
              <RecommendWebtoonCard
                key={webtoon.webtoonId}
                webtoonId={webtoon.webtoonId}
              />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  )
}

export default TodayRecommend
