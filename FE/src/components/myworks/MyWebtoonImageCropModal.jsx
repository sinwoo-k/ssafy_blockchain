import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../../utils/image/cropImage'

const MyWebtoonImageCropModal = ({ image, setImage, setShowModal, type }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, onZoomChange] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

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
              className={`relative ${type === 'sero' ? 'h-[300px] min-w-[300px]' : 'h-[400px] min-w-[400px]'} overflow-hidden `}
            >
              <Cropper
                image={URL.createObjectURL(image)}
                crop={crop}
                zoom={zoom}
                aspect={type === 'sero' ? 2 / 3 : 4 / 3}
                onCropChange={setCrop}
                onZoomChange={onZoomChange}
                onCropComplete={onCropComplete}
                cropSize={
                  type === 'sero'
                    ? { width: 200, height: 300 }
                    : { width: 400, height: 300 }
                }
              />
            </div>
          </div>
          <div className='mt-2 flex justify-center gap-5'>
            <button className='text-chaintoon' onClick={handleCropConfirm}>
              이미지 등록
            </button>
            <button
              className='text-red-600'
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
