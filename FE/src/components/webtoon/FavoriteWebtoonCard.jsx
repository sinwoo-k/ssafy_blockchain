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
      <div className='border-chaintoon mb-3 w-full rounded-xl border'>
        <Link to={`/webtoon/${webtoon.webtoonId}`}>
          <img
            src={webtoon.seroThumbnail}
            alt={`${webtoon.webtoonName} 대표 이미지`}
            className='h-[250px] w-[200px] rounded-xl object-cover'
          />
        </Link>
      </div>
      {/* 웹툰 정보 */}
      <div className='w-full px-1'>
        <h2 className='truncate text-lg'>{webtoon.webtoonName}</h2>
        <p className='text-text/75 truncate'>{webtoon.writer}</p>
      </div>
      {/* 업데이트 일자 및 관심 취소 버튼 */}
      <div className='flex items-center justify-between px-1'>
        <div className='text-chaintoon'>
          <span className='inline-block translate-y-[1px] transform'>
            {formatUploadDate(webtoon.lastUploadDate)}
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
