import React, { useState } from 'react'
import dayjs from 'dayjs'
import { getRandomColor } from '../../utils/randomColor'
// 아이콘
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

const CommentCard = ({ comment }) => {
  const [randomColor, setRandomColor] = useState(getRandomColor())
  const [replies, setReplies] = useState(comment.replies)
  const [replyRandomColor, setReplyRandomColor] = useState(
    comment.replies.map((_) => getRandomColor()),
  )

  // 답글 보기
  const [showChildren, setShowChildren] = useState(false)

  // 답글 토글
  const toggleChildren = () => {
    setShowChildren(!showChildren)
  }

  return (
    <div className='flex flex-col gap-3 border-b px-5 py-3'>
      {/* 유저 프로필 */}
      <div className='flex items-center gap-3'>
        {comment.profileImage ? (
          <div className='flex h-[35px] w-[35px] items-center justify-center rounded-full'>
            <img
              alt={comment.profileImage}
              className='bg-text/30 h-[30px] w-[30px] rounded-full'
            />
          </div>
        ) : (
          <AccountCircleIcon sx={{ fontSize: 35, color: randomColor }} />
        )}
        <p>{comment.userNickname}</p>
      </div>
      {/* 댓글 본문 */}
      <p>{comment.content}</p>
      {/* 댓글 작성일 */}
      <p className='text-text/75'>
        {dayjs(comment.createdAt).format('YYYY.MM.DD')}
      </p>
      {/* 버튼 영역 */}
      <div className='flex justify-between'>
        <button
          className='border-chaintoon flex cursor-pointer gap-2 rounded border px-2 py-1 text-sm'
          onClick={toggleChildren}
        >
          <span>답글</span>
          <span>{comment.replies.length}</span>
        </button>
        {/* 좋아요&싫어요 */}
        <div className='flex gap-3'>
          <button className='border-chaintoon flex cursor-pointer items-center gap-2 rounded border px-2 py-1 text-sm'>
            <ThumbUpIcon sx={{ fontSize: 20, color: '#ff5099' }} />
            <span>{comment.likes}</span>
          </button>
          <button className='border-chaintoon flex cursor-pointer items-center gap-2 rounded border px-2 py-1 text-sm'>
            <ThumbDownIcon sx={{ fontSize: 20, color: '#5099ff' }} />
            <span>{comment.dislikes}</span>
          </button>
        </div>
      </div>
      {showChildren && (
        <div className='flex flex-col'>
          {replies.map((reply, index) => (
            <div className='flex gap-5 py-2'>
              {/* 답글 표시 */}
              <div className='flex w-[50px] justify-center'>
                <SubdirectoryArrowRightIcon sx={{ fontSize: 20 }} />
              </div>
              {/* 답글 */}
              <div className='flex w-full flex-col gap-3'>
                {/* 유저 프로필 */}
                <div className='flex items-center gap-3'>
                  {reply.profileImage ? (
                    <div className='flex h-[35px] w-[35px] items-center justify-center rounded-full'>
                      <img
                        alt={reply.profileImage}
                        className='bg-text/30 h-[30px] w-[30px] rounded-full'
                      />
                    </div>
                  ) : (
                    <AccountCircleIcon
                      sx={{ fontSize: 35, color: replyRandomColor[index] }}
                    />
                  )}
                  <p>{reply.userNickname}</p>
                </div>
                {/* 답글 본문 */}
                <p>{reply.content}</p>
                {/* 답글 작성일 */}
                <p className='text-text/75'>
                  {dayjs(reply.createdAt).format('YYYY.MM.DD')}
                </p>
                {/* 버튼 영역 */}
                <div className='flex justify-end'>
                  {/* 좋아요&싫어요 */}
                  <div className='flex gap-3'>
                    <button className='border-chaintoon flex cursor-pointer items-center gap-2 rounded border px-2 py-1 text-sm'>
                      <ThumbUpIcon sx={{ fontSize: 20, color: '#ff5099' }} />
                      <span>{reply.likes}</span>
                    </button>
                    <button className='border-chaintoon flex cursor-pointer items-center gap-2 rounded border px-2 py-1 text-sm'>
                      <ThumbDownIcon sx={{ fontSize: 20, color: '#5099ff' }} />
                      <span>{reply.dislikes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className='border-text/50 flex gap-5 border-t py-2'>
            {/* 답글 표시 */}
            <div className='flex w-[50px] flex-none justify-center'>
              <SubdirectoryArrowRightIcon sx={{ fontSize: 20 }} />
            </div>
            {/* 답글 */}
            <div className='flex grow gap-3'>
              <input
                type='text'
                className='bg-text/50 h-[45px] grow rounded-lg'
              />
              <button className='bg-chaintoon h-[45px] w-[100px] flex-none rounded-lg text-black'>
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentCard
