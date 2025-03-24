import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../../utils/image/cropImage'

const MyWebtoonImageCropModal = ({
  image,
  setImage,
  setShowModal,
  width,
  height,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, onZoomChange] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const size = width > height ? width * 100 : height * 100

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCropConfirm = async () => {
    const croppedImageUrl = await getCroppedImg(
      URL.createObjectURL(image),
      croppedAreaPixels,
    )
    const response = await fetch(croppedImageUrl)
    const blob = await response.blob()
    const croppedFile = new File([blob], image.name, { type: image.type })

    setImage(croppedFile) // 크롭된 이미지 파일을 상태에 저장
    setShowModal(false)
  }

  return (
    <div className='fixed top-0 left-0 z-50'>
      <div
        className='bg-text/30 fixed flex h-full w-full items-center justify-center'
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className='flex flex-col rounded-xl bg-black px-10 py-5'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flexgrow m-3 flex-col justify-between'>
            <div
              className={`relative overflow-hidden `}
              style={{ height: `${size}px`, width: `${size}px` }}
            >
              <Cropper
                image={URL.createObjectURL(image)}
                crop={crop}
                zoom={zoom}
                aspect={width / height}
                onCropChange={setCrop}
                onZoomChange={onZoomChange}
                onCropComplete={onCropComplete}
                cropSize={{ width: width * 100, height: height * 100 }}
              />
            </div>
          </div>
          <div className='mt-2 flex justify-center gap-5'>
            <button
              className='text-chaintoon curosr-pointer'
              onClick={handleCropConfirm}
            >
              이미지 등록
            </button>
            <button
              className='cursor-pointer text-red-600'
              onClick={() => setShowModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyWebtoonImageCropModal
