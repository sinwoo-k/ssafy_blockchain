import React, { useState } from 'react'

// 아이콘
import StarIcon from '@mui/icons-material/Star'
import EpisodeRatingModal from './EpisodeRatingModal'

const WebtoonEpisodeUtility = ({ writerComment, rating }) => {
  // 별점 등록 여부
  const [isRate, setIsRate] = useState(false)
  // 별점 모달 on/off
  const [showModal, setShowModal] = useState(false)

  return (
    <div className='mb-10 flex justify-center'>
      <div className='flex w-[1000px] flex-col gap-10'>
        {/* 작가의 말 */}
        <div className='flex flex-col gap-2'>
          <h2 className='text-lg'>작가의 말</h2>
          <div className='border-text min-h-[80px] rounded-lg border px-2 py-1'>
            {writerComment}
          </div>
        </div>
        {/* 별점 기능 */}
        <div className='flex justify-between'>
          {/* 에피소드 평점 평균 */}
          <div className='flex items-end gap-1'>
            <StarIcon sx={{ fontSize: 25, color: '#ffff19' }} />
            <span className='inline-block w-[45px] translate-y-[1px] transform'>
              {rating}
            </span>
            <span className='text-text/75 inline-block translate-y-[1px] transform'>
              1,100명
            </span>
          </div>
          {/* 별점 주기 */}
          {isRate ? (
            <span>참여 완료</span>
          ) : (
            <button
              className='cursor-pointer'
              onClick={() => setShowModal(true)}
            >
              별점 주기
            </button>
          )}
          {showModal && <EpisodeRatingModal setShowModal={setShowModal} />}
        </div>
      </div>
    </div>
  )
}

export default WebtoonEpisodeUtility
