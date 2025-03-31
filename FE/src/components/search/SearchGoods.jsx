import React from 'react'
import SearchGoodsCard from './SearchGoodsCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'

const SearchGoods = ({ goodsList }) => {
  return (
    <div className='flex w-[1000px] flex-col gap-3 py-5'>
      <h2 className='text-xl'>굿즈</h2>
      <div className='flex justify-between'>
        <span>총 {goodsList.length}건</span>
      </div>
      <div>
        {goodsList.length === 0 ? (
          <div className='flex w-full flex-col items-center justify-center gap-3'>
            <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
            <p className='text-xl'>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className='grid grid-cols-5'>
            {goodsList.map((goods) => (
              <SearchGoodsCard key={`goods-${goods.goodsId}`} goods={goods} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchGoods
