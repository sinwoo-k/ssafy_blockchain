import React from 'react'
import IconButton from '../common/IconButton'

// 아이콘
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Link } from 'react-router-dom'
import { deleteGoods } from '../../api/goodsAPI'

const GoodsCard = ({ goods, patchData }) => {
  const deleteData = async () => {
    try {
      const result = await deleteGoods(goods.goodsId)
      patchData()
    } catch (error) {
      console.error('굿즈 삭제 실패: ', error)
    }
  }
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
            <Link
              to={`/myworks/webtoon/goods/update/${goods.goodsId}`}
              className='text-blue-500'
            >
              <IconButton Icon={EditIcon} tooltip={'수정하기'} />
            </Link>
            <div className='text-red-500' onClick={deleteData}>
              <IconButton Icon={DeleteIcon} tooltip={'삭제하기'} />
            </div>
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
