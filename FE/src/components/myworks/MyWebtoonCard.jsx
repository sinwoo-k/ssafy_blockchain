import React from 'react'
import { formattingNumber } from '../../utils/formatting'

// 아이콘
import StarIcon from '@mui/icons-material/Star'
import VisibilityIcon from '@mui/icons-material/Visibility'

const MyWebtoonCard = ({ webtoon }) => {
  console.log(webtoon)
  return (
    <div className='inset-shadow-text/30 shadow-text/30 flex gap-5 rounded-lg p-3 shadow inset-shadow-xs '>
      {/* 썸네일 이미지 */}
      <div>
        <img
          src={webtoon?.garoThumbnail}
          alt={`${webtoon.webtoonName} 가로 썸네일`}
          className='w-[150px] rounded-lg object-cover'
        />
      </div>
      {/* 회차 정보 */}
      <div className='flex flex-col justify-between py-2'>
        <div>
          <p className='text-lg'>{webtoon?.webtoonName}</p>
          <span className='text-text/50 px-1'>{webtoon?.episodeCount} 화</span>
        </div>
        <div className='flex gap-2'>
          <span className='flex items-center gap-1'>
            <StarIcon sx={{ color: '#999999' }} />
            <span className='inline-block w-[45px] translate-y-[1px] transform'>
              {(webtoon?.rating / 2).toFixed(2)}
            </span>
          </span>
          <span className='flex items-center gap-2'>
            <VisibilityIcon sx={{ color: '#999999' }} />
            <span className='inline-block w-[45px] translate-y-[1px] transform'>
              {formattingNumber(webtoon.viewCount)}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default MyWebtoonCard
