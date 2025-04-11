import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { getRandomColor } from '../../utils/randomColor'
import {
  createComment,
  createCommentHate,
  createCommentLike,
  deleteComment,
  deleteCommentHate,
  deleteCommentLike,
  getCommentReplies,
  patchComment,
} from '../../api/commentAPI'
import ReplyCard from './ReplyCard'
import IconButton from '../common/IconButton'

// 아이콘
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const CommentCard = ({ comment, patchData }) => {
  const navigate = useNavigate()

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const userData = useSelector((state) => state.user.userData)

  const [replies, setReplies] = useState([])
  const [randomColor, setRandomColor] = useState(getRandomColor())

  const [commentContent, setCommentContent] = useState('')

  const [content, setContent] = useState('')
  const [updateContent, setUpdateContent] = useState('')

  const [isLike, setIsLike] = useState(false)
  const [isHate, setIsHate] = useState(false)
  const [like, setLike] = useState(0)
  const [hate, setHate] = useState(0)

  const [isUpdate, setIsUpdate] = useState(false)

  // 답글 보기
  const [showChildren, setShowChildren] = useState(false)

  // 답글 토글
  const toggleChildren = () => {
    setShowChildren(!showChildren)
  }

  const getData = async () => {
    try {
      const result = await getCommentReplies(comment.commentId)
      setReplies(result)
    } catch (error) {
      console.error('답글 조회 실패: ', error)
      navigate('/error', { state: { message: error.response.data.message } })
    }
  }

  const createReply = async () => {
    if (!isAuthenticated) {
      return
    }
    const payload = {
      usageId: comment.usageId,
      type: 'COMMENT_EPISODE',
      parentId: comment.commentId,
      content: content,
    }
    try {
      const result = await createComment(payload)
      patchData()
      getData()
      setContent('')
    } catch (error) {
      console.error('답글 등록 실패: ', error)
    }
  }

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
        const result = await deleteCommentLike(comment.commentId)
        setIsLike(false)
        setLike((prev) => prev - 1)
      } catch (error) {
        console.error('좋아요 취소 실패: ', error)
      }
    } else {
      try {
        const result = await createCommentLike(comment.commentId)
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
        const result = await deleteCommentHate(comment.commentId)
        setIsHate(false)
        setHate((prev) => prev - 1)
      } catch (error) {
        console.error('싫어요 취소 실패: ', error)
      }
    } else {
      try {
        const result = await createCommentHate(comment.commentId)
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
      setUpdateContent(commentContent)
    }
  }

  const updateComment = async () => {
    const payload = {
      content: updateContent,
    }
    try {
      const result = await patchComment(comment.commentId, payload)
      setCommentContent(result.content)
      setIsUpdate(false)
    } catch (error) {
      console.error('댓글 수정 실패: ', error)
    }
  }

  const deleteData = async () => {
    try {
      const result = await deleteComment(comment.commentId)
      patchData()
    } catch (error) {
      console.error('답글 삭제 실패: ', error)
    }
  }

  useEffect(() => {
    setIsLike(comment.hasLiked === 'Y' ? true : false)
    setIsHate(comment.hasHated === 'Y' ? true : false)
    setLike(comment.likeCount)
    setHate(comment.hateCount)
    setCommentContent(comment.content)
  }, [comment])

  useEffect(() => {
    // mount
    getData()
    // unmount
    return () => {}
  }, [])

  return (
    <div className='flex w-[1000px] flex-col gap-3 border-b px-5 py-3'>
      <div className='flex justify-between'>
        {/* 유저 프로필 */}
        <div className='flex items-center gap-3'>
          {comment.profileImage ? (
            <div className='flex h-[35px] w-[35px] items-center justify-center rounded-full'>
              <img
                src={comment.profileImage}
                alt={`작성자 프로필 이미지`}
                className='bg-text/30 h-[30px] w-[30px] rounded-full'
              />
            </div>
          ) : (
            <AccountCircleIcon sx={{ fontSize: 35, color: randomColor }} />
          )}
          <p>{comment.nickname}</p>
        </div>
        {/* 댓글 수정 & 삭제 */}
        {userData && userData?.id === comment.userId && (
          <div className='flex gap-3'>
            <div
              className='text-text/75 hover:text-blue-500'
              onClick={toggleEdit}
            >
              <IconButton Icon={EditIcon} tooltip={'댓글 수정'} />
            </div>
            <div
              className='text-text/75 hover:text-red-500'
              onClick={deleteData}
            >
              <IconButton Icon={DeleteIcon} tooltip={'댓글 삭제'} />
            </div>
          </div>
        )}
      </div>
      {/* 댓글 본문 */}
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
        <p className='break-words'>{commentContent}</p>
      )}
      {/* 댓글 작성일 */}
      <p className='text-text/75'>
        {dayjs(comment.createDate).format('YYYY.MM.DD')}
      </p>
      {/* 버튼 영역 */}
      <div className='flex justify-between'>
        <button
          className='border-chaintoon flex cursor-pointer gap-2 rounded border px-2 py-1 text-sm'
          onClick={toggleChildren}
        >
          <span>답글</span>
          <span>{comment.replyCount}</span>
        </button>
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
      {showChildren && (
        <div className='flex flex-col'>
          {replies?.map((reply) => (
            <ReplyCard
              key={reply.commentId}
              reply={reply}
              patchData={getData}
            />
          ))}
          <div className='border-text/50 flex gap-5 border-t py-2'>
            {/* 답글 표시 */}
            <div className='flex w-[50px] flex-none justify-center'>
              <SubdirectoryArrowRightIcon sx={{ fontSize: 20 }} />
            </div>
            {/* 답글 */}
            <div className='bg-text/30 flex grow flex-col items-center rounded-lg border px-3 py-2'>
              <textarea
                className='h-[72px] w-full resize-none focus:outline-none'
                value={content}
                onChange={(event) => setContent(event.target.value)}
                maxLength={255}
                placeholder={
                  isAuthenticated
                    ? '답글을 입력해주세요.'
                    : '로그인 후 이용가능합니다.'
                }
                disabled={!isAuthenticated}
              ></textarea>
              <div className='flex w-full items-end justify-end gap-3'>
                <span className='text-text/75'>{content.length} / 255</span>
                <button
                  className='bg-chaintoon flex-none cursor-pointer rounded-lg px-3 py-1 text-black'
                  onClick={createReply}
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentCard
