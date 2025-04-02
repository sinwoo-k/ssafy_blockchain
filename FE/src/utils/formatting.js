/** kmb 단위로 숫자 변환 */
export const formattingNumber = (number) => {
  if (number >= 1_000_000_000) {
    // 10억 이상
    return (number / 1_000_000_000).toFixed(1) + 'B'
  } else if (number >= 1_000_000) {
    // 100만 이상
    return (number / 1_000_000).toFixed(1) + 'M'
  } else if (number >= 1_000) {
    // 1천 이상
    return (number / 1_000).toFixed(1) + 'K'
  } else {
    // 1천 미만
    return String(number)
  }
}

/** 숫자 콤마 찍기 */
export const addComma = (number) => {
  let returnString = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return returnString
}

/** 업로드 날짜 변환 */
export const formatUploadDate = (uploadDateStr, threshold = 7) => {
  const today = new Date()

  const uploadDate = new Date(uploadDateStr)
  const diffTime = today - uploadDate
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < threshold) {
    return diffDays === 0 ? '오늘' : `${diffDays}일 전`
  } else {
    // YYYY-MM-DD 형식으로 반환합니다.
    const year = uploadDate.getFullYear()
    const month = String(uploadDate.getMonth() + 1).padStart(2, '0')
    const day = String(uploadDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
}
