import API from './API'

/** 웹툰 목록 조회 */
export const getWebtoonList = async (
  page = 1,
  pageSize = 50,
  orederBy = 'latest',
) => {
  const response = await API.get(
    `/webtoons?page=${page}&pageSize=${pageSize}&orderBy=${orederBy}`,
  )
  return response.data
}

/** 웹툰 상세 조회 */
export const getWebtoon = async (webtoonId) => {
  const response = await API.get(`/webtoons/${webtoonId}`)
  return response.data
}

/** 회차 목록 조회 */
export const getEpisodeList = async (webtoonId) => {
  const response = await API.get(`/episodes?webtoonId=${webtoonId}`)
  return response.data
}

/** 회차 상세 조회 */
export const getEpisode = async (episodeId) => {
  const response = await API.get(`/episodes/${episodeId}`)
  return response.data
}

/** 내 웹툰 조회 */
export const getMyWebtoon = async (page = 1, pageSize = 10) => {
  const response = await API.get(
    `/webtoons/my?page=${page}&pageSize=${pageSize}`,
  )
  return response.data
}

/** 웹툰 등록 */
export const createWebtoon = async (webtoon, garoImage, seroImage) => {
  const formData = new FormData()
  formData.append(
    'webtoon',
    new Blob([JSON.stringify(webtoon)], { type: 'application/json' }),
  )
  formData.append('garoImage', garoImage)
  formData.append('seroImage', seroImage)

  const response = await API.post(`/webtoons`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/** 웹툰 정보 수정 */
export const patchWebtoon = async (
  webtoonId,
  webtoon,
  garoImage,
  seroImage,
) => {
  const formData = new FormData()
  formData.append(
    'webtoon',
    new Blob([JSON.stringify(webtoon)], { type: 'application/json' }),
  )
  if (garoImage) {
    formData.append('garoImage', garoImage)
  }
  if (seroImage) {
    formData.append('seroImage', seroImage)
  }

  const response = await API.patch(`/webtoons/${webtoonId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response
}
