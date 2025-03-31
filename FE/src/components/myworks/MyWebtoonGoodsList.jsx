import React, { useEffect, useState } from 'react'
import GoodsCard from './GoodsCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'

const MyWebtoonGoodsList = ({ webtoonId }) => {
  const [goodsList, setGoodsList] = useState([])

  useEffect(() => {
    // mount
    setGoodsList([
      {
        goodsId: 0,
        goodsName: '굿즈 1',
        goodsImage: `https://placehold.co/300x300?text=Goods+${1}`,
      },
    ])
    // unmount
    return () => {}
  }, [])
  return (
    <div className='flex justify-center'>
      <div className='w-[1000px]'>
        <div className='mb-3 flex justify-between'>
          <p>총 {goodsList?.length || 0}개</p>
          <div className='flex gap-2'>
            <button className='hover:text-chaintoon cursor-pointer'>
              최신순
            </button>
            <button className='hover:text-chaintoon cursor-pointer'>
              오래된 순
            </button>
          </div>
        </div>
        <div className='grid grid-cols-4'>
          {goodsList.length === 0 ? (
            <div className='flex h-[300px] w-full flex-col items-center justify-center gap-3'>
              <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
              <p className='text-xl'>등록된 굿즈가 없습니다.</p>
            </div>
          ) : (
            goodsList.map((goods) => (
              <GoodsCard key={goods.goodsId} goods={goods} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default MyWebtoonGoodsList
