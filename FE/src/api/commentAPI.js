import API from './API'

/** 댓글 목록 조회 */
export const getComments = async (usageId, type, page = 1, pageSize = 10) => {
  const response = await API.get(
    `/comments?usageId=${usageId}&type=${type}&page=${page}&pageSize=${pageSize}`,
  )
  return response.data
}

/** 대댓글 목록 조회 */
export const getCommentReplies = async (commentId) => {
  const response = await API.get(`/comments/${commentId}`)
  return response.data
}

/** 댓글 등록 */
export const createComment = async (payload) => {
  const response = await API.post(`/comments`, payload)
  return response.data
}
