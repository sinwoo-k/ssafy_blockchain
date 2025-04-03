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

  return response.data
}

/** 웹툰 삭제 */
export const deleteWebtoon = async (webtoonId) => {
  const response = await API.delete(`/webtoons/${webtoonId}`)
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

/** 첫 회차 조회  */
export const getFirstEpisode = async (webtoonId) => {
  const response = await API.get(`/episodes/first?webtoonId=${webtoonId}`)
  return response.data
}

/** 최신 회차 조회 */
export const getLatestEpisode = async (webtoonId) => {
  const response = await API.get(`/episodes/latest?webtoonId=${webtoonId}`)
  return response.data
}

/** 회차 등록 */
export const createEpisode = async (episode, thumbnail, images) => {
  const formData = new FormData()
  formData.append(
    'episode',
    new Blob([JSON.stringify(episode)], { type: 'application/json' }),
  )
  formData.append('thumbnail', thumbnail)
  images.forEach((obj) => {
    formData.append('images', obj.file)
  })
  const response = await API.post(`/episodes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/** 회차 수정 */
export const patchEpisode = async (
  episodeId,
  episode,
  thumbnail,
  imagesData,
) => {
  const formData = new FormData()
  formData.append(
    'episode',
    new Blob([JSON.stringify(episode)], { type: 'application/json' }),
  )
  if (thumbnail) {
    formData.append('thumbnail', thumbnail)
  }
  const images = []
  const newImages = []
  imagesData.forEach((image) => {
    if (image.type === 'old') {
      images.push({ imageId: image.file.imageId })
    }
    if (image.type === 'new') {
      const newFileName = Date.now() + '_' + image.file.name
      const newFile = new File([image.file], newFileName, {
        type: image.file.type,
      })
      images.push({ newImage: newFileName })
      newImages.push(newFile)
    }
  })
  formData.append(
    'images',
    new Blob([JSON.stringify(images)], { type: 'application/json' }),
  )
  newImages.forEach((obj) => {
    formData.append('newImages', obj)
  })

  const response = await API.patch(`/episodes/${episodeId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/** 회차 삭제 */
export const deleteEpisode = async (episodeId) => {
  const response = await API.delete(`/episodes/${episodeId}`)
  return response.data
}

/** 별점 등록 */
export const createRating = async (episodeId, rating) => {
  const response = await API.post(
    `/episodes/${episodeId}/rating?rating=${rating}`,
  )
  return response.data
}

/** 관심 웹툰 조회 */
export const getFavoriteWebtoon = async () => {
  const response = await API.get('/webtoons/favorites')
  return response.data
}

/** 관심 웹툰 등록 */
export const createFavoriteWebtoon = async (webtoonId) => {
  const response = await API.post(`/webtoons/${webtoonId}/favorite`)
  return response.data
}

/** 관심 웹툰 취소 */
export const deleteFavoriteWebtoon = async (webtoonId) => {
  const response = await API.delete(`/webtoons/${webtoonId}/favorite`)
  return response.data
}
