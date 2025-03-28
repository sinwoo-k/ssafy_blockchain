import React, { useState } from 'react'
// 아이콘
import ErrorIcon from '@mui/icons-material/Error'
import CommentCard from './CommentCard'

const dummyData = {
  episodeId: 12,
  count: 6,
  comments: [
    {
      commentId: 1,
      userId: 'cherry12',
      userNickname: '체리피커',
      content: '이 에피소드 진짜 대박이네요!',
      likes: 10,
      dislikes: 0,
      createdAt: '2025-03-18T10:12:33+09:00',
      replies: [
        {
          replyId: 1,
          userId: 'panda999',
          userNickname: '판다귀여워',
          content: '동감합니다! 작가님 최고!',
          likes: 2,
          dislikes: 0,
          createdAt: '2025-03-18T10:33:10+09:00',
        },
        {
          replyId: 2,
          userId: 'lovelyFlower',
          userNickname: '꽃을든남자',
          content: '제일 재밌던 장면이 어디였나요?',
          likes: 0,
          dislikes: 0,
          createdAt: '2025-03-18T11:02:00+09:00',
        },
      ],
    },
    {
      commentId: 2,
      userId: 'blueSky21',
      userNickname: '푸른하늘',
      content: '최근에 가장 흥미진진한 편이었어요.',
      likes: 5,
      dislikes: 1,
      createdAt: '2025-03-18T10:20:01+09:00',
      replies: [],
    },
    {
      commentId: 3,
      userId: 'gamerKing',
      userNickname: '게임왕',
      content: '흠... 이번 편은 생각보다 별로였어요.',
      likes: 0,
      dislikes: 2,
      createdAt: '2025-03-18T10:35:44+09:00',
      replies: [
        {
          replyId: 1,
          userId: 'devilcat',
          userNickname: '악마고양이',
          content: '저는 재밌었는데 아쉽네요 ㅎㅎ',
          likes: 1,
          dislikes: 0,
          createdAt: '2025-03-18T11:05:02+09:00',
        },
      ],
    },
  ],
}

const CommentList = ({ usageId, type }) => {
  // 댓글 목록
  const [comments, setComments] = useState(dummyData)

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
          {comments.comments.length === 0 ? (
            <div className='flex h-[300px] w-full flex-col items-center justify-center gap-3'>
              <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
              <p className='text-xl'>등록된 댓글이 없습니다.</p>
            </div>
          ) : (
            <div className='border-t'>
              {comments.comments.map((comment) => (
                <CommentCard key={comment.commentId} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentList
