import React, { useEffect, useState } from 'react'

// carousel
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import NewFanartCard from './NewFanartCard'

const dummyData = [1, 2, 3, 4, 5, 6, 7].map((number) => {
  return {
    fanartId: number,
    userId: 1,
    webtoonId: 1,
    fanartImage: `https://placehold.co/300x300?text=Fanart+${number}`,
    fanartName: '팬아트 테스트',
    garoThumbnail: null,
    seroThumbnail: null,
    description: null,
    webtoonName: null,
    writer: null,
  }
})

const NewFanartList = () => {
  const [fanarts, setFanarts] = useState([])

  // carousel setting
  const setting = {
    dots: false,
    Infinity: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    draggable: false,
  }

  const getData = () => {
    setFanarts(dummyData)
  }

  useEffect(() => {
    // mount
    getData()
    // unmount
    return () => {}
  }, [])
  return (
    <div className='flex justify-center'>
      <div className='w-[1000px] py-20'>
        <h1 className='mb-5 text-xl'>따끈따끈 신규 팬아트</h1>
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
