import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import IconButton from '../common/IconButton'
import FanartDetailModal from './FanartDetailModal'

const dummyData = {
  fanartId: 1,
  userId: 1,
  webtoonId: 8,
  fanartImage:
    'https://chain-toon.s3.ap-northeast-2.amazonaws.com/fanart/1/image/8f5e8c53-23b2-464d-ba3a-d231e6638dd7.png',
  fanartName: '신의탑3 팬아트 수정 테스트',
  webtoonName: '신의 탑3',
  userNickname: null,
  description: '수정 - 직접 그린 신의탑3 팬아트에용',
  likeCount: 0,
}

const FanartDetailInfo = ({ fanartId }) => {
  const [fanart, setFanart] = useState(dummyData) // 팬아트 정보
  const [isLike, setIsLike] = useState(false) // 좋아요 여부
  const [showFanartModal, setShowFanartModal] = useState(false) // 모달 열림/닫힘

  const handleLike = () => {
    if (!isLike) {
      setFanart((prev) => ({ ...prev, likeCount: fanart.likeCount + 1 }))
    } else {
      setFanart((prev) => ({ ...prev, likeCount: fanart.likeCount - 1 }))
    }
    setIsLike(!isLike)
  }

  return (
    <div className='flex justify-center'>
      <div className='flex w-[1000px] gap-15 py-20'>
        {/* 팬아트 이미지 */}
        <div className='relative flex-none rounded-lg'>
          <img
            src={fanart.fanartImage}
            alt={`${fanart.fanartName}`}
            className='max-h-[400px] w-auto rounded-lg'
          />
          <div
            className='absolute right-1 bottom-1 z-10 cursor-pointer rounded-full bg-black/75 p-2'
            onClick={() => setShowFanartModal(true)}
          >
            <IconButton Icon={OpenInFullIcon} tooltip={'크게 보기'} />
          </div>
        </div>

        {/* 팬아트 정보 */}
        <div className='flex grow flex-col gap-5'>
          {/* 팬아트명 및 웹툰명 */}
          <div className='flex-none'>
            <p className='text-xl'>{fanart.fanartName}</p>
            <Link to={`/webtoon/${fanart.webtoonId}`}>
              <p className='text-text/75 text-lg'>{fanart.webtoonName}</p>
            </Link>
          </div>
          {/* 작가 정보 */}
          <div className='flex flex-none gap-3'>
            <div className='bg-text overflow-hidden rounded-full'>
              <img className='h-[30px] w-[30px]' />
            </div>
            <p className='text-lg'>{fanart.userNickname || '작가미상'}</p>
          </div>
          {/* 팬아트 설명 + 좋아요 */}
          <div className='flex grow flex-col justify-between'>
            <div>
              <p>{fanart.description}</p>
            </div>
            <div className='flex items-center gap-3'>
              <button className='cursor-pointer' onClick={handleLike}>
                {isLike ? (
                  <FavoriteIcon
                    className='text-red-500'
                    sx={{ fontSize: 25 }}
                  />
                ) : (
                  <FavoriteBorderIcon
                    className='text-red-500'
                    sx={{ fontSize: 25 }}
                  />
                )}
              </button>
              <p className='inline-block translate-y-[1px] transform text-xl'>
                {fanart.likeCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <FanartDetailModal
        isOpen={showFanartModal}
        onClose={() => setShowFanartModal(false)}
        fanartImage={fanart.fanartImage}
      />
    </div>
  )
}

export default FanartDetailInfo
