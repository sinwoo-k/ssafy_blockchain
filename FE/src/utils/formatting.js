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
