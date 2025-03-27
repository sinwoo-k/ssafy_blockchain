import React from 'react'

const WebtoonViewer = ({ handleClickViewer, images }) => {
  // 우클릭 방지
  const handleContextMenuCapture = (event) => {
    event.preventDefault()
  }

  // 드래그 방지
  const handleDragStartCapture = (event) => {
    event.preventDefault()
  }

  return (
    <div
      className='mt-[60px] flex flex-col items-center justify-center'
      onClick={handleClickViewer}
      onContextMenuCapture={handleContextMenuCapture}
      onDragStartCapture={handleDragStartCapture}
    >
      {images?.map((image, index) => (
        <div key={`image-${index}`} className='w-[690px]'>
          <img src={image} alt={`웹툰 이미지-${index}`} className='w-[690px]' />
        </div>
      ))}
    </div>
  )
}

export default WebtoonViewer
