import React, { useEffect, useRef, useState } from 'react'

const WebtoonViewer = ({ handleClickViewer, images }) => {
  // 캔바스
  const canvasRef = useRef(null)

  // 우클릭 방지
  const handleContextMenuCapture = (event) => {
    event.preventDefault()
  }

  // 드래그 방지
  const handleDragStartCapture = (event) => {
    event.preventDefault()
  }
  // canvas 이미지 로드
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const promises = images.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        // img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = (err) => reject(err)
      })
    })

    Promise.all(promises)
      .then((images) => {
        let totalHeight = 0
        let maxWidth = 0

        images.forEach((img) => {
          totalHeight += img.height
          if (img.width > maxWidth) {
            maxWidth = img.width
          }
        })

        canvas.width = maxWidth
        canvas.height = totalHeight

        let currentY = 0
        images.forEach((img) => {
          ctx.drawImage(img, 0, currentY)
          currentY += img.height
        })
      })
      .catch((err) => {
        console.error('이미지 로드 에러', err)
      })
  }, [])

  return (
    <div
      className='mt-[60px] flex justify-center'
      onClick={handleClickViewer}
      onContextMenuCapture={handleContextMenuCapture}
      onDragStartCapture={handleDragStartCapture}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}

export default WebtoonViewer
