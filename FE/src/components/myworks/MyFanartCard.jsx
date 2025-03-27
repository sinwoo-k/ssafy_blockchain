import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import IconButton from '../common/IconButton'

// 아이콘
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const MyFanartCard = ({ fanart }) => {
  const [isHover, setIsHover] = useState(false)
  return (
    <div className='flex justify-center'>
      <div className='flex flex-col gap-3'>
        <div
          className='relative'
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
        >
          <Link to={`/fanart/${fanart.fanartId}`}>
            <img
              src={fanart.fanartImage}
              alt={`${fanart.fanartName} 이미지`}
              className='h-[200px] w-[180px] rounded-lg object-cover'
            />
          </Link>
        </div>
        <div className='flex justify-between'>
          <button className='hover:text-chaintoon cursor-pointer'>
            NFT 발행하기
          </button>
          <div className='flex gap-3'>
            <IconButton
              Icon={EditIcon}
              tooltip={'수정하기'}
              style={{ color: '#2599ff' }}
            />
            <IconButton
              Icon={DeleteIcon}
              tooltip={'삭제하기'}
              style={{ color: '#ff5050' }}
            />
          </div>
        </div>
        <div>
          <p className='w-[180px] truncate text-lg'>{fanart.fanartName}</p>
          <p className='text-text/75 w-[180px] truncate'>웹툰명</p>
        </div>
      </div>
    </div>
  )
}

export default MyFanartCard
