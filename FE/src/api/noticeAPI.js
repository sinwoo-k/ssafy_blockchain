import API from './API'

/** 내 알림 조회 */
export const getNotice = async () => {
  const response = await API.get('/notices')
  return response.data
}

/** 알림 읽음 처리 */
export const patchNotice = async (noticeId) => {
  const response = await API.patch(`/notices/${noticeId}`)
  return response.data
}

/** 알림 삭제 */
export const deleteNotcie = async (noticeId) => {
  const response = await API.delete(`/notices/${noticeId}`)
  return response.data
}
