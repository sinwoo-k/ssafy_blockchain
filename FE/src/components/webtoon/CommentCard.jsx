import React, { useState } from 'react'
import dayjs from 'dayjs'
// 아이콘
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'

const CommentCard = ({ comment }) => {
  // 답글 보기
  const [showChildren, setShowChildren] = useState(false)

  // 답글 토글
  const toggleChildren = () => {
    if (comment.replies.length !== 0) {
      setShowChildren(!showChildren)
    }
  }

  return (
    <div className='flex flex-col gap-3 border-b px-5 py-3'>
      {/* 유저 프로필 */}
      <div className='flex items-center gap-3'>
        <div className='border-chaintoon rounded-full border'>
          <img
            src=''
            alt=''
            className='bg-text/50 h-[35px] w-[35px] rounded-full'
          />
        </div>
        <p className='text-lg'>{comment.userNickname}</p>
      </div>
      {/* 댓글 본문 */}
      <p className='text-lg'>{comment.content}</p>
      {/* 댓글 작성일 */}
      <p className='text-text/75 text-lg'>
        {dayjs(comment.createdAt).format('YYYY.MM.DD')}
      </p>
      {/* 버튼 영역 */}
      <div className='flex justify-between'>
        <button
          className='border-chaintoon flex cursor-pointer gap-2 rounded border px-2 py-1'
          onClick={toggleChildren}
        >
          <span>답글</span>
          <span>{comment.replies.length}</span>
        </button>
        {/* 좋아요&싫어요 */}
        <div className='flex gap-3'>
          <button className='border-chaintoon flex cursor-pointer items-center gap-2 rounded border px-2 py-1'>
            <ThumbUpIcon sx={{ fontSize: 20, color: '#ff5099' }} />
            <span>{comment.likes}</span>
          </button>
          <button className='border-chaintoon flex cursor-pointer items-center gap-2 rounded border px-2 py-1'>
            <ThumbDownIcon sx={{ fontSize: 20, color: '#5099ff' }} />
            <span>{comment.dislikes}</span>
          </button>
        </div>
      </div>
      {showChildren && (
        <div className='flex flex-col gap-5'>
          {comment.replies.map((reply) => (
            <div className='flex gap-5 px-5 py-2'>
              {/* 답글 표시 */}
              <div className='flex w-[25px] justify-center'>
                <SubdirectoryArrowRightIcon sx={{ fontSize: 25 }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentCard
