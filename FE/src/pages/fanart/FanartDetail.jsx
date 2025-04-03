import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import FanartDetailInfo from '../../components/fanart/FanartDetailInfo'
import CommentList from '../../components/comment/CommentList'

const FanartDetail = () => {
  const params = useParams()
  const [commentCount, setCommentCount] = useState(0)

  return (
    <div className='py-[60px]'>
      <FanartDetailInfo
        fanartId={params.fanartId}
        setCommentCount={setCommentCount}
      />
      <CommentList
        usageId={params.fanartId}
        type={'COMMENT_FANART'}
        commentCount={commentCount}
        setCommentCount={setCommentCount}
      />
    </div>
  )
}

export default FanartDetail
