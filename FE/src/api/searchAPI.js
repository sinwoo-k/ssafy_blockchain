import API from './API'

/** 통합 검색 */
export const getAllSearch = async (keyword, pageSize = 10) => {
  const response = await API.get(
    `/search/all?keyword=${keyword}&pageSize=${pageSize}`,
  )
  return response.data
}

/** 도메인별 검색 */
export const getDomainSearch = async (
  page = 1,
  pageSize = 20,
  keyword,
  type,
) => {
  const response = await API.get(
    `/search?type=${type}&keyword=${keyword}&page=${page}&pageSize=${pageSize}`,
  )
  return response.data
}
