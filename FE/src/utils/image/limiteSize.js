export const checkWidthSize = (width, file) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = () => {
      const maxWidth = width
      // 이미지의 가로 크기가 제한을 초과하면 리사이즈
      if (image.naturalWidth > maxWidth) {
        const scaleFactor = maxWidth / image.naturalWidth
        const canvas = document.createElement('canvas')
        canvas.width = maxWidth
        canvas.height = image.naturalHeight * scaleFactor
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob) {
            // Blob으로부터 새 File 객체 생성
            const resizedFile = new File([blob], file.name, { type: file.type })
            resolve(resizedFile)
          } else {
            reject(new Error('이미지 리사이즈에 실패했습니다.'))
          }
        }, file.type)
      } else {
        // 이미지 가로 크기가 제한 내라면 원본 파일 그대로 반환
        resolve(file)
      }
    }
    image.onerror = () => {
      reject(new Error('이미지 로드에 실패했습니다.'))
    }
  })
}
