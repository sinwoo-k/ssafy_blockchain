import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MyFanartCard from '../../components/myworks/MyFanartCard'
import { getMyFanarts } from '../../api/fanartAPI'

const MyFanart = () => {
  const [fanarts, setFanarts] = useState([])

  const getData = async () => {
    try {
      const result = await getMyFanarts()
      setFanarts(result)
    } catch (error) {
      console.error('내 팬아트 조회 실패: ', error)
    }
  }

  useEffect(() => {
    // mount
    getData()
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
        </div>
        <div className='grid grid-cols-5 gap-3 gap-y-5'>
          {fanarts.map((fanart) => (
            <MyFanartCard
              key={fanart.fanartId}
              fanart={fanart}
              patchData={getData}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyFanart
