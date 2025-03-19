import React, { useState } from 'react'

// 아이콘
import StarIcon from '@mui/icons-material/Star'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import StarBorderIcon from '@mui/icons-material/StarBorder'

const EpisodeRatingModal = ({ setShowModal }) => {
  // 선택된 별점(0.5 ~ 5.0)
  const [rating, setRating] = useState(5.0)

  // 별 아이콘 결정
  const getStarIcon = (starIndex) => {
    if (rating >= starIndex) {
      return <StarIcon sx={{ fontSize: 45, color: '#3cc3ec' }} />
    } else if (rating >= starIndex - 0.5) {
      return <StarHalfIcon sx={{ fontSize: 45, color: '#3cc3ec' }} />
    } else {
      return <StarBorderIcon sx={{ fontSize: 45, color: '#3cc3ec' }} />
    }
  }

  // 별 클릭 시 rating을 변경
  const handleClick = (newRating) => {
    setRating(newRating)
  }

  return (
    <div className='fixed top-0 left-0 z-50'>
      <div className='bg-text/30 fixed flex h-full w-full items-center justify-center'>
        <div className='flex flex-col rounded-xl bg-black px-10 py-5'>
          {/* 모달 main */}
          <div className='m-3 flex grow flex-col justify-between'>
            <div className='mb-5 flex flex-col items-center gap-3'>
              {/* 별점 선택 */}
              <div className='flex gap-2'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={`star-${star}`}
                    style={{
                      position: 'relative',
                      width: '45px',
                      height: '45px',
                    }}
                  >
                    {/* 별의 왼쪽 절반 */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        width: '50%',
                        height: '100%',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleClick(star - 0.5)}
                    />
                    {/* 별의 오른쪽 절반 */}
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        width: '50%',
                        height: '100%',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleClick(star)}
                    />
                    {/* 별 아이콘 출력 */}
                    {getStarIcon(star)}
                  </div>
                ))}
              </div>
              <p className='text-chaintoon text-2xl'>{rating.toFixed(1)}</p>
              <p className='text-text/75 text-lg'>별점을 클릭해주세요.</p>
            </div>
            <button className='hover:text-chaintoon cursor-pointer'>
              별점 주기
            </button>
          </div>
          {/* 모달 하단 */}
          <div className='mt-2 flex flex-none justify-center'>
            <button
              className='cursor-pointer text-red-600'
              onClick={() => setShowModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EpisodeRatingModal
