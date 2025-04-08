import API from './API'

/** 내 알림 조회 */
export const getNotice = async (page = 1, pageSize = 20) => {
  const response = await API.get(`/notices?page=${page}&pageSize=${pageSize}`)
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

/** 아림 전체 삭제 */
export const deleteAllNotice = async () => {
  const response = await API.delete(`/notice`)
  return response.data
}
