import API from '../API'

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
