import React from 'react'
import IconButton from '../common/IconButton'
import MintNFT from '../common/MintNFT'

// 아이콘
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Link } from 'react-router-dom'
import { deleteGoods } from '../../api/goodsAPI'

const GoodsCard = ({ goods, patchData }) => {
  const deleteData = async () => {
    if (!confirm('삭제하시겠습니까?')) {
      return
    }
    try {
      const result = await deleteGoods(goods.goodsId)
      patchData()
    } catch (error) {
      console.error('굿즈 삭제 실패: ', error)
      alert('굿즈 정보 삭제에 실패하였습니다. 다시 시도해주세요.')
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
          <MintNFT item={goods} type='goods' afterMint={patchData} />
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
