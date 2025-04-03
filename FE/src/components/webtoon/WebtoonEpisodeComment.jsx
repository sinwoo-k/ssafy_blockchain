import React, { useEffect, useState } from 'react'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'
import CommentCard from './CommentCard'
import { getComments } from '../../api/commentAPI'

const WebtoonEpisodeComment = ({ episodeId }) => {
  // 댓글 목록
  const [comments, setComments] = useState([])

  const getData = async () => {
    try {
      const data = await getComments(episodeId, 'COMMENT_EPISODE')
      setComments(data)
    } catch (error) {
      console.error('댓글 조회 실패: ', error)
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
          <span className='text-text/75 '>{comments.count}</span>
        </div>
        {/* 댓글 입력창 */}
        <div className='mb-5 flex gap-3'>
          <input type='text' className='bg-text/50 h-[45px] grow rounded-lg' />
          <button className='bg-chaintoon h-[45px] w-[100px] flex-none rounded-lg text-black'>
            등록
          </button>
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
                <CommentCard key={comment.commentId} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WebtoonEpisodeComment
