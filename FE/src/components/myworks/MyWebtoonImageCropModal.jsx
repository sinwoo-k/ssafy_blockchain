import React, { useState, useCallback, useEffect } from 'react'
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
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const size = width > height ? width * 100 : height * 100

  // image prop에서 URL 생성 및 cleanup (한 번만 생성)
  const [imageUrl, setImageUrl] = useState('')
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image)
      setImageUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [image])

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCropConfirm = async () => {
    try {
      // useEffect에서 생성한 imageUrl을 사용
      const croppedImageUrl = await getCroppedImg(imageUrl, croppedAreaPixels)
      const response = await fetch(croppedImageUrl)
      const blob = await response.blob()
      const croppedFile = new File([blob], image.name, { type: image.type })

      setImage(croppedFile) // 크롭된 이미지 파일을 상태에 저장
      setShowModal(false)
    } catch (error) {
      console.error('Error cropping image:', error)
    }
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
              className='relative overflow-hidden'
              style={{ height: `${size}px`, width: `${size}px` }}
            >
              {imageUrl && (
                <Cropper
                  image={imageUrl} // 상태로 관리된 imageUrl 사용
                  crop={crop}
                  zoom={zoom}
                  aspect={width / height}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropSize={{ width: width * 100, height: height * 100 }}
                />
              )}
            </div>
          </div>
          <div className='mt-2 flex justify-center gap-5'>
            <button
              className='text-chaintoon cursor-pointer'
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
