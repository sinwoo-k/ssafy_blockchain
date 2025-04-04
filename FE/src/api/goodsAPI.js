import API from './API'

/** 굿즈 목록 조회 */
export const getGoodsList = async (webtoonId) => {
  const response = await API.get(`/goods/webtoons/${webtoonId}`)
  return response.data
}

/** 굿즈 상세 조회 */
export const getGoods = async (goodsId) => {
  const response = await API.get(`/goods/${goodsId}`)
  return response.data
}

/** 굿즈 등록 */
export const createGoods = async (goods, goodsImage) => {
  const formData = new FormData()
  formData.append(
    'goods',
    new Blob([JSON.stringify(goods)], { type: 'application/json' }),
  )
  formData.append('goodsImage', goodsImage)
  const response = await API.post(`/goods`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/** 굿즈 수정 */
export const patchGoods = async (goodsId, goods, goodsImage) => {
  const formData = new FormData()
  formData.append(
    'goods',
    new Blob([JSON.stringify(goods)], { type: 'application/json' }),
  )
  if (goodsImage) {
    formData.append('goodsImage', goodsImage)
  }
  console.log(goods)
  const response = await API.patch(`/goods/${goodsId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/** 굿즈 삭제 */
export const deleteGoods = async (goodsId) => {
  const response = await API.delete(`/goods/${goodsId}`)
  return response.data
}
