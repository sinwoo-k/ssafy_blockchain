import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import IconButton from '../common/IconButton'

// 아이콘
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NFTCreateModal from '../common/NFTCreateModal'
import { useSelector } from 'react-redux'
import { deleteFanart } from '../../api/fanartAPI'

const MyFanartCard = ({ fanart, patchData }) => {
  const [showModal, setShowModal] = useState(false)

  const userData = useSelector((state) => state.user.userData)

  const deleteData = async () => {
    try {
      const result = await deleteFanart(fanart.fanartId, userData.id)
      patchData()
    } catch (error) {
      console.error('팬아트 삭제 실패: ', error)
    }
  }
  return (
    <div className='flex justify-center'>
      <div className='flex flex-col gap-3'>
        <div className='relative'>
          <Link to={`/fanart/${fanart.fanartId}`}>
            <img
              src={fanart.fanartImage}
              alt={`${fanart.fanartName} 이미지`}
              className='h-[200px] w-[180px] rounded-lg object-cover'
            />
          </Link>
        </div>
        <div className='flex justify-between'>
          <button
            className='hover:text-chaintoon cursor-pointer'
            onClick={() => setShowModal(true)}
          >
            NFT 발행하기
          </button>
          <div className='flex gap-3'>
            <Link
              to={`/myworks/fanart/${fanart.fanartId}/update`}
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
          <p className='w-[180px] truncate text-lg'>{fanart.fanartName}</p>
          <p className='text-text/75 w-[180px] truncate'>웹툰명</p>
        </div>
      </div>
      {showModal && (
        <NFTCreateModal
          item={fanart}
          type={'fanart'}
          setShowModal={setShowModal}
        />
      )}
    </div>
  )
}

export default MyFanartCard
