import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
// 아이콘
import ErrorIcon from '@mui/icons-material/Error'
import CommentCard from './CommentCard'
import { createComment, getComments } from '../../api/commentAPI'
import { addComma } from '../../utils/formatting'

const CommentList = ({ usageId, type, commentCount, setCommentCount }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // 댓글 목록
  const [comments, setComments] = useState([])

  const [content, setContent] = useState('')

  const getData = async () => {
    try {
      const result = await getComments(usageId, type, page)
      setComments((prev) => [...prev, ...result])
      setPage((prev) => prev + 1)
      if (result.length < 10) {
        setHasMore(false)
      }
    } catch (error) {
      console.error('댓글 조회 실패: ', error)
    }
  }

  const createData = async () => {
    if (!isAuthenticated) {
      return
    }
    const payload = {
      usageId: usageId,
      type: type,
      parentId: 0,
      content: content,
    }
    try {
      const result = await createComment(payload)
      setComments((prev) => [...prev, result])
      setContent('')
      setCommentCount((prev) => prev + 1)
    } catch (error) {
      console.error('댓글 등록 실패: ', error)
    }
  }

  useEffect(() => {
    // mount
    getData()
    // unmount
    return () => {}
  }, [])

  return (
    <div className='flex justify-center'>
      <div className='w-[1000px]'>
        <div className='mb-3 flex items-end gap-3'>
          <h2 className='text-xl'>댓글</h2>
          <span className='text-text/75 '>{addComma(commentCount || 0)}</span>
        </div>
        {/* 댓글 입력창 */}
        <div className='mb-5 flex gap-3'>
          <div className='bg-text/30 flex grow flex-col items-center rounded-lg border px-3 py-2'>
            <textarea
              className='h-[72px] w-full resize-none focus:outline-none'
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={255}
              placeholder={
                isAuthenticated
                  ? '댓글을 입력해주세요.'
                  : '로그인 후 이용가능합니다.'
              }
              disabled={!isAuthenticated}
            ></textarea>
            <div className='flex w-full items-end justify-end gap-3'>
              <span className='text-text/75'>{content.length} / 255</span>
              <button
                className='bg-chaintoon flex-none cursor-pointer rounded-lg px-3 py-1 text-black'
                onClick={createData}
              >
                등록
              </button>
            </div>
          </div>
        </div>
        {/* 댓글 목록 */}
        <div>
          {comments.length === 0 ? (
            <div className='flex h-[300px] w-full flex-col items-center justify-center gap-3'>
              <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
              <p className='text-xl'>등록된 댓글이 없습니다.</p>
            </div>
          ) : (
            <div className='border-t'>
              {comments.map((comment) => (
                <CommentCard
                  key={comment.commentId}
                  comment={comment}
                  patchData={getData}
                  setCommentCount={setCommentCount}
                />
              ))}
            </div>
          )}
        </div>
        {comments.length !== 0 && hasMore && (
          <div className='mt-5 flex w-full justify-center'>
            <button
              className='hover:text-chaintoon cursor-pointer'
              onClick={getData}
            >
              더보기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentList
