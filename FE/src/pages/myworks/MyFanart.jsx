import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MyFanartCard from '../../components/myworks/MyFanartCard'

const dummy = Array(14)
  .fill()
  .map((_, i) => {
    // 100 ~ 400 사이의 랜덤 크기를 예시로 만듭니다.
    const randomWidth = Math.floor(Math.random() * 101) + 200 // 200~300
    const randomHeight = Math.floor(Math.random() * 201) + 200 // 200~400
    return {
      fanartId: i + 1,
      fanartName: `팬아트 ${i + 1}`,
      fanartImage: `https://placehold.co/${randomWidth}x${randomHeight}?text=Fanart+${i + 1}`,
    }
  })

const MyFanart = () => {
  const [fanarts, setFanarts] = useState([])

  useEffect(() => {
    // mount
    setFanarts(dummy)
    // unmount
    return () => {}
  }, [])
  return (
    <div className='flex justify-center pt-[60px]'>
      <div className='w-[1000px] py-10'>
        <div className='mb-10 flex items-center gap-3'>
          <h1 className='text-chaintoon text-2xl'>내 팬아트</h1>
          <span className='text-2xl'>|</span>
          <Link to={'/myworks/webtoon'} className='text-text/75 text-xl'>
            내 웹툰
          </Link>
        </div>
        {/* 내 팬아트 utils */}
        <div className='mb-3 flex items-end justify-between'>
          <p>총 {fanarts.length}개</p>
          <div className='flex gap-3'>
            <button className='hover:text-chaintoon cursor-pointer'>
              최신순
            </button>
            <button className='hover:text-chaintoon cursor-pointer'>
              오래된순
            </button>
          </div>
        </div>
        <div className='grid grid-cols-5 gap-3 gap-y-5'>
          {fanarts.map((fanart) => (
            <MyFanartCard key={fanart.fanartId} fanart={fanart} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyFanart
