import React from 'react'
import { useParams } from 'react-router-dom'
import FanartDetailInfo from '../../components/fanart/FanartDetailInfo'
import CommentList from '../../components/comment/CommentList'

const FanartDetail = () => {
  const params = useParams()

  return (
    <div className='py-[60px]'>
      <FanartDetailInfo fanartId={params.fanartId} />
      <CommentList usageId={params.fanartId} type={'COMMENT_FANART'} />
    </div>
  )
}

export default FanartDetail
