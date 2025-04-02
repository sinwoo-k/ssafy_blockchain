import React, { useEffect, useState } from 'react'
import GoodsCard from './GoodsCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'
import { getGoodsList } from '../../api/goodsAPI'

const MyWebtoonGoodsList = ({ webtoonId }) => {
  const [goodsList, setGoodsList] = useState([])

  const getData = async () => {
    try {
      const result = await getGoodsList(webtoonId)
      setGoodsList(result.goodsList)
    } catch (error) {
      console.error('굿즈 목록 조회 실패: ', error)
    }
  }

  useEffect(() => {
    // mount
    getData()
    // unmount
    return () => {}
  }, [])
  return (
    <div className='flex justify-center'>
      <div className='w-[1000px]'>
        <div className='mb-3 flex justify-between'>
          <p>총 {goodsList.length || 0}개</p>
        </div>
        <div>
          {goodsList.length === 0 ? (
            <div className='flex h-[300px] w-full flex-col items-center justify-center gap-3'>
              <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
              <p className='text-xl'>등록된 굿즈가 없습니다.</p>
            </div>
          ) : (
            <div className='grid grid-cols-4'>
              {goodsList.map((goods) => (
                <GoodsCard
                  key={goods.goodsId}
                  goods={goods}
                  patchData={getData}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyWebtoonGoodsList
