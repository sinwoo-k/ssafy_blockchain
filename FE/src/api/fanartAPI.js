import API from './API'

/** 최신 팬아트 조회 */
export const getLatestFanarts = async () => {
  const response = await API.get(`/fanarts/latest`)
  return response.data
}

/** 웹툰별 팬아트 조회  */
export const getWebtoonFanarts = async (webtoonId) => {
  const response = await API.get(`/fanarts/webtoons/${webtoonId}`)
  return response.data
}

/** 내 팬아트 조회 */
export const getMyFanarts = async () => {
  const response = await API.get(`/fanarts/my-fanart`)
  return response.data
}

/** 유저 팬아트 조회 */
export const getUserFanarts = async (
  userId,
  page = 1,
  pageSize = 10,
  orderBy = 'latest',
) => {
  const response = await API.get(
    `fanarts/latest?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&writerId=${userId}`,
  )
  return response.data
}

/** 팬아트 상세 조회 */
export const getFanart = async (fanartId) => {
  const response = await API.get(`/fanarts/${fanartId}`)
  return response.data
}

/** 팬아트 등록 */
export const createFanart = async (fanart, fanartImage) => {
  const formData = new FormData()
  formData.append(
    'fanart',
    new Blob([JSON.stringify(fanart)], { type: 'application/json' }),
  )
  formData.append('fanartImage', fanartImage)

  const response = await API.post(`/fanarts`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/** 팬아트 수정 */
export const patchFanart = async (fanartId, fanart, fanartImage) => {
  const formData = new FormData()
  formData.append(
    'fanart',
    new Blob([JSON.stringify(fanart)], { type: 'application/json' }),
  )
  if (fanartImage) {
    formData.append('fanartImage', fanartImage)
  }

  const response = await API.patch(`/fanarts/${fanartId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/** 팬아트 삭제 */
export const deleteFanart = async (fanartId, userId) => {
  const response = await API.delete(`/fanarts/${fanartId}?userId=${userId}`)
  return response.data
}

/** 팬아트 좋아요 */
export const createFanartLike = async (fanartId, userId) => {
  const response = await API.post(`/fanarts/${fanartId}/like?userId=${userId}`)
  return response.data
}

/** 팬아트 싫어요 */
export const deleteFanartLike = async (fanartId, userId) => {
  const response = await API.delete(
    `/fanarts/${fanartId}/like?userId=${userId}`,
  )
  return response.data
}
