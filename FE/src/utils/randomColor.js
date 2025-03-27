export const getRandomColor = () => {
  // 128~255 범위에서 R, G, B 값 생성
  const r = 128 + Math.floor(Math.random() * 128)
  const g = 128 + Math.floor(Math.random() * 128)
  const b = 128 + Math.floor(Math.random() * 128)

  // 16진수로 변환 (각각 2자리 보장)
  const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`

  return color
}
