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

/** 댓글 수정 */
export const patchComment = async (commentId, payload) => {
  const response = await API.patch(`/comments/${commentId}`, payload)
  return response.data
}

/** 댓글 삭제 */
export const deleteComment = async (commentId) => {
  const response = await API.delete(`/comments/${commentId}`)
  return response.data
}

/** 댓글 좋아요 */
export const createCommentLike = async (commentId) => {
  const response = await API.post(`/comments/${commentId}/like`)
  return response.data
}

/** 댓글 좋아요 취소 */
export const deleteCommentLike = async (commentId) => {
  const response = await API.delete(`/comments/${commentId}/like`)
  return response.data
}

/** 댓글 싫어요 */
export const createCommentHate = async (commentId) => {
  const response = await API.post(`/comments/${commentId}/hate`)
  return response.data
}

/** 댓글 싫어요 취소 */
export const deleteCommentHate = async (commentId) => {
  const response = await API.delete(`/comments/${commentId}/hate`)
  return response.data
}
