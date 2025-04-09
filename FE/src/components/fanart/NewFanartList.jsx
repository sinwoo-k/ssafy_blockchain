import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NewFanartCard from './NewFanartCard'
import { getLatestFanarts } from '../../api/fanartAPI'

// carousel
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const NewFanartList = () => {
  const navigate = useNavigate()

  const [fanarts, setFanarts] = useState([])
  const [backgroundImg, setBackgroundImg] = useState(null)

  // carousel setting
  const setting = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (current, next) => {
      setBackgroundImg(fanarts[next]?.fanartImage)
    },
    draggable: false,
  }

  const getData = async () => {
    try {
      const result = await getLatestFanarts()
      setFanarts(result)
      setBackgroundImg(result[0].fanartImage)
    } catch (error) {
      console.error('최신 팬아트 조회 실패: ', error)
      navigate('/error', { state: { message: error.response.data.message } })
    }
  }

  useEffect(() => {
    // mount
    getData()
    // unmount
    return () => {}
  }, [])
  return (
    <div className='relative flex justify-center'>
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: `url(${backgroundImg})`,
          filter: 'blur(15px) brightness(0.5)',
        }}
      ></div>
      <div className='relative w-[1000px] py-30'>
        <h1 className='mb-5 text-xl'>🎨 따끈따끈 신규 팬아트</h1>
        {/* <div className='flex gap-3 px-2'> */}
        <Slider {...setting}>
          {fanarts.map((fanart) => (
            <NewFanartCard key={fanart.fanartId} fanart={fanart} />
          ))}
        </Slider>
        {/* </div> */}
      </div>
    </div>
  )
}

export default NewFanartList
