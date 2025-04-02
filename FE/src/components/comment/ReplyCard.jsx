import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { getRandomColor } from '../../utils/randomColor'
import {
  createCommentHate,
  createCommentLike,
  deleteComment,
  deleteCommentHate,
  deleteCommentLike,
  patchComment,
} from '../../api/commentAPI'
import IconButton from '../common/IconButton'

// 아이콘
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const ReplyCard = ({ reply, patchData }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const userData = useSelector((state) => state.user.userData.id)
  const [randomColor, setRandomColor] = useState(getRandomColor())

  const [replyContent, setReplyContent] = useState('')

  const [updateContent, setUpdateContent] = useState('')

  const [isLike, setIsLike] = useState(false)
  const [isHate, setIsHate] = useState(false)
  const [like, setLike] = useState(0)
  const [hate, setHate] = useState(0)

  const [isUpdate, setIsUpdate] = useState(false)

  const toggleLike = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.')
      return
    }
    if (isHate) {
      alert('싫어요한 댓글입니다.')
      return
    }
    if (isLike) {
      try {
        const result = await deleteCommentLike(reply.commentId)
        setIsLike(false)
        setLike((prev) => prev - 1)
      } catch (error) {
        console.error('좋아요 취소 실패: ', error)
      }
    } else {
      try {
        const result = await createCommentLike(reply.commentId)
        setIsLike(true)
        setLike((prev) => prev + 1)
      } catch (error) {
        console.error('좋아요 실패: ', error)
      }
    }
  }

  const toggleHate = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.')
      return
    }
    if (isLike) {
      alert('좋아요한 댓글입니다.')
      return
    }
    if (isHate) {
      try {
        const result = await deleteCommentHate(reply.commentId)
        setIsHate(false)
        setHate((prev) => prev - 1)
      } catch (error) {
        console.error('싫어요 취소 실패: ', error)
      }
    } else {
      try {
        const result = await createCommentHate(reply.commentId)
        setIsHate(true)
        setHate((prev) => prev + 1)
      } catch (error) {
        console.error('싫어요 실패: ', error)
      }
    }
  }

  const toggleEdit = () => {
    if (isUpdate) {
      setIsUpdate(false)
      setUpdateContent('')
    } else {
      setIsUpdate(true)
      setUpdateContent(replyContent)
    }
  }

  const updateComment = async () => {
    const payload = {
      content: updateContent,
    }
    try {
      const result = await patchComment(reply.commentId, payload)
      setReplyContent(result.content)
      setIsUpdate(false)
    } catch (error) {
      console.error('답글 수정 실패: ', error)
    }
  }

  const deleteData = async () => {
    try {
      const result = await deleteComment(reply.commentId)
      patchData()
    } catch (error) {
      console.error('답글 삭제 실패: ', error)
    }
  }

  useEffect(() => {
    setIsLike(reply.hasLiked === 'Y' ? true : false)
    setIsHate(reply.hasHated === 'Y' ? true : false)
    setLike(reply.likeCount)
    setHate(reply.hateCount)
    setReplyContent(reply.content)
  }, [reply])

  return (
    <div className='flex gap-5 py-2'>
      {/* 답글 표시 */}
      <div className='flex w-[50px] justify-center'>
        <SubdirectoryArrowRightIcon sx={{ fontSize: 20 }} />
      </div>
      {/* 답글 */}
      <div className='flex w-full flex-col gap-3'>
        <div className='flex justify-between'>
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
              <AccountCircleIcon sx={{ fontSize: 35, color: randomColor }} />
            )}
            <p>{reply.nickname}</p>
          </div>
          {/* 댓글 수정 & 삭제 */}
          {userData === reply.userId && (
            <div className='flex gap-3'>
              <div className='text-blue-500' onClick={toggleEdit}>
                <IconButton Icon={EditIcon} tooltip={'댓글 수정'} />
              </div>
              <div className='text-red-500' onClick={deleteData}>
                <IconButton Icon={DeleteIcon} tooltip={'댓글 삭제'} />
              </div>
            </div>
          )}
        </div>
        {/* 답글 본문 */}
        {isUpdate ? (
          <div className='bg-text/30 flex grow flex-col items-center rounded-lg border px-3 py-2'>
            <textarea
              className='h-[72px] w-full resize-none focus:outline-none'
              value={updateContent}
              onChange={(event) => setUpdateContent(event.target.value)}
              maxLength={255}
            ></textarea>
            <div className='flex w-full items-end justify-end gap-3'>
              <span className='text-text/75'>{updateContent.length} / 255</span>
              <button
                className='bg-chaintoon flex-none cursor-pointer rounded-lg px-3 py-1 text-black'
                onClick={updateComment}
              >
                수정
              </button>
            </div>
          </div>
        ) : (
          <p className='break-words'>{replyContent}</p>
        )}
        {/* 답글 작성일 */}
        <p className='text-text/75'>
          {dayjs(reply.createDate).format('YYYY.MM.DD')}
        </p>
        {/* 버튼 영역 */}
        <div className='flex justify-end'>
          {/* 좋아요&싫어요 */}
          <div className='flex gap-3'>
            <button
              className='border-chaintoon flex cursor-pointer items-center gap-2 rounded border px-2 py-1 text-sm'
              onClick={toggleLike}
            >
              <ThumbUpIcon sx={{ fontSize: 20, color: '#ff5099' }} />
              <span>{like}</span>
            </button>
            <button
              className='border-chaintoon flex cursor-pointer items-center gap-2 rounded border px-2 py-1 text-sm'
              onClick={toggleHate}
            >
              <ThumbDownIcon sx={{ fontSize: 20, color: '#5099ff' }} />
              <span>{hate}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReplyCard
