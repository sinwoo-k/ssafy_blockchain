import React from 'react'
import { Link } from 'react-router-dom'
import { deleteFavoriteWebtoon } from '../../api/webtoonAPI'
import { formatUploadDate } from '../../utils/formatting'

// 아이콘
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '../common/IconButton'

const FavoriteWebtoonCard = ({ webtoon, patchData }) => {
  const deleteData = async () => {
    if (!confirm('관심 웹툰에서 삭제하시겠습니까?')) {
      return
    }
    try {
      const result = await deleteFavoriteWebtoon(webtoon.webtoonId)
      patchData()
    } catch (error) {
      console.error('괸심 웹툰 취소 실패: ', error)
    }
  }
  return (
    <div className='mx-5 w-[200px]'>
      {/* 웹툰 대표이미지 */}
      <div className='mb-3 w-full overflow-hidden rounded-xl'>
        <Link to={`/webtoon/${webtoon.webtoonId}`}>
          <img
            src={webtoon.seroThumbnail}
            alt={`${webtoon.webtoonName} 대표 이미지`}
            className='h-[250px] w-[200px] rounded-xl object-cover
            transition-transform duration-150 ease-in-out hover:scale-105'
          />
        </Link>
      </div>
      {/* 웹툰 정보 */}
      <div className='w-full px-1'>
        <Link to={`/webtoon/${webtoon.webtoonId}`}>
          <h2 className='truncate text-lg hover:underline'>
            {webtoon.webtoonName}
          </h2>
        </Link>
        <Link to={`/user/${webtoon.userId}`}>
          <p className='text-text/75 truncate hover:underline'>
            {webtoon.writer}
          </p>
        </Link>
      </div>
      {/* 업데이트 일자 및 관심 취소 버튼 */}
      <div className='flex items-center justify-between px-1'>
        <div className='text-chaintoon'>
          <span className='inline-block translate-y-[1px] transform'>
            {webtoon.lastUploadDate !== ''
              ? formatUploadDate(webtoon.lastUploadDate)
              : ''}
          </span>
        </div>
        <div className='text-red-500' onClick={deleteData}>
          <IconButton Icon={DeleteIcon} tooltip={'관심 웹툰 취소'} />
        </div>
      </div>
    </div>
  )
}

export default FavoriteWebtoonCard
