import React from 'react'
import IconButton from '../common/IconButton'

// 아이콘
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Link } from 'react-router-dom'

const GoodsCard = ({ goods }) => {
  return (
    <div className='flex justify-center'>
      <div className='flex flex-col gap-3'>
        <div className='relative'>
          <img
            src={goods.goodsImage}
            alt={`${goods.goodsName} 이미지`}
            className='h-[200px] w-[180px] rounded-lg object-cover'
          />
        </div>
        <div className='flex justify-between'>
          <button className='hover:text-chaintoon cursor-pointer'>
            NFT 발행하기
          </button>
          <div className='flex gap-3'>
            <Link to={`/myworks/webtoon/goods/update/${goods.goodsId}`}>
              <IconButton
                Icon={EditIcon}
                tooltip={'수정하기'}
                style={{ color: '#2599ff' }}
              />
            </Link>
            <IconButton
              Icon={DeleteIcon}
              tooltip={'삭제하기'}
              style={{ color: '#ff5050' }}
            />
          </div>
        </div>
        <div>
          <p className='w-[180px] truncate text-lg'>{goods.goodsName}</p>
        </div>
      </div>
    </div>
  )
}

export default GoodsCard
