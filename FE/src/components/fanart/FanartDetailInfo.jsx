import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import IconButton from '../common/IconButton'
import FanartDetailModal from './FanartDetailModal'
import {
  createFanartLike,
  deleteFanartLike,
  getFanart,
} from '../../api/fanartAPI'
import { getRandomColor } from '../../utils/randomColor'

// 아이콘
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

const FanartDetailInfo = ({ fanartId, setCommentCount }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const userData = useSelector((state) => state.user.userData)

  const [fanart, setFanart] = useState({}) // 팬아트 정보
  const [isLike, setIsLike] = useState(false) // 좋아요 여부
  const [showFanartModal, setShowFanartModal] = useState(false) // 모달 열림/닫힘
  const [randomColor, setRandomColor] = useState(getRandomColor())

  const getData = async () => {
    try {
      const result = await getFanart(fanartId)
      setFanart(result)
      setIsLike(result.hasLiked === 'Y' ? true : false)
      setCommentCount(result.commentCount)
    } catch (error) {
      console.error('팬아트 상세 조회 실패: ', error)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.')
      return
    }
    if (!isLike) {
      try {
        const result = await createFanartLike(fanartId, userData.id)
        setFanart((prev) => ({ ...prev, likeCount: fanart.likeCount + 1 }))
      } catch (error) {
        console.error('좋아요 실패: ', error)
      }
    } else {
      try {
        const result = await deleteFanartLike(fanartId, userData.id)
        setFanart((prev) => ({ ...prev, likeCount: fanart.likeCount - 1 }))
      } catch (error) {
        console.error('좋아요 취소 실패: ', error)
      }
    }
    setIsLike(!isLike)
  }

  useEffect(() => {
    // mount
    getData()
    // unmount
    return () => {}
  }, [])

  return (
    <div className='flex justify-center'>
      <div className='flex w-[1000px] gap-15 py-20'>
        {/* 팬아트 이미지 */}
        <div className='relative flex-none rounded-lg'>
          <img
            src={fanart.fanartImage}
            alt={`${fanart.fanartName}`}
            className='max-h-[400px] min-h-[200px] w-auto min-w-[100px] rounded-lg'
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
              <span className='text-text/75 text-lg'>{fanart.webtoonName}</span>
            </Link>
          </div>
          {/* 작가 정보 */}
          <div className='flex flex-none items-center gap-3'>
            {fanart.profileImage ? (
              <div className='bg-text overflow-hidden rounded-full'>
                <img src={fanart.profileImage} className='h-[30px] w-[30px]' />
              </div>
            ) : (
              <AccountCircleIcon sx={{ fontSize: 32, color: randomColor }} />
            )}
            <p className='text-lg'>{fanart.nickname || '작가미상'}</p>
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
