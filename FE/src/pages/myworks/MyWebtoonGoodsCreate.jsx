import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

// 아이콘
import UploadFileIcon from '@mui/icons-material/UploadFile'
import ClearIcon from '@mui/icons-material/Clear'

const MyWebtoonGoodsCreate = () => {
  const params = useParams()

  const [goodsImage, setGoodsImage] = useState(null) // 굿즈 이미지
  const [goodsImageURL, setGoodsImageURL] = useState('')
  const [webtoonName, setWeboonName] = useState('') // 웹툰명
  const [goodsName, setGoodsName] = useState('') // 굿즈명
  const [goodsDescription, setGoodsDescription] = useState('') // 굿즈 설명

  // 드래그 & 드랍 관련 이벤트 함수
  const [dragOver, setDragOver] = useState(false)
  const dragCounter = useRef(0)
  const handleDragEnter = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dragCounter.current += 1
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setDragOver(true)
    }
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dragCounter.current -= 1
    if (dragCounter.current === 0) {
      setDragOver(false)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDragDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dragCounter.current = 0
    setDragOver(false)
    if (event.dataTransfer) {
      const file = event.dataTransfer.files[0]
      setGoodsImage(file)
      setGoodsImageURL(URL.createObjectURL(file))
    }
  }

  const selectGoodsImage = (file) => {
    setGoodsImage(file)
    setGoodsImageURL(URL.createObjectURL(file))
  }

  const clearGoodsImage = () => {
    setGoodsImage(null)
    setGoodsImageURL('')
  }

  // 굿즈 등록 함수
  const createGoods = () => {
    if (goodsImage === null) {
      alert('굿즈를 등록해주세요.')
    } else if (goodsName.trim() === '') {
      alert('굿즈명을 작성해주세요.')
    } else if (goodsDescription.trim() === '') {
      alert('굿즈 설명을 작성해주세요.')
    } else {
      const payload = {
        goodsName: goodsName,
        goodsDescription: goodsDescription,
      }
      console.log(payload)
    }
  }

  useEffect(() => {
    // mount
    setWeboonName('테스트')
    // unmount
    return () => {}
  }, [])

  return (
    <div className='flex justify-center pt-[60px]'>
      <div className='w-[1000px] pt-15'>
        <h1 className='mb-8 text-xl'>굿즈 등록하기</h1>
        <div className='mb-8 flex gap-10'>
          {/* 굿즈 이미지 */}
          <div className='flex-none'>
            {goodsImageURL !== '' ? (
              <div className='relative'>
                <img
                  src={goodsImageURL}
                  alt='업로드 굿즈 이미지'
                  className='h-[600px] w-[450px] rounded-lg object-cover'
                />
                <button
                  className='absolute right-2 bottom-2'
                  onClick={clearGoodsImage}
                >
                  <ClearIcon
                    sx={{ fontSize: 50 }}
                    className='bg-text/50 hover:bg-text/75 cursor-pointer rounded-full p-2 
                    text-black/75 hover:text-black'
                  />
                </button>
              </div>
            ) : (
              <label
                htmlFor='goods-image'
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDragDrop}
              >
                <div
                  className={`flex h-[600px] w-[450px] cursor-pointer flex-col
                items-center justify-center gap-3 rounded-lg border 
                ${dragOver ? 'bg-chaintoon/75 border-chaintoon' : 'bg-text/30 border-text'}`}
                >
                  <UploadFileIcon
                    sx={{
                      fontSize: 50,
                    }}
                  />
                  <p>굿즈를 선택하거나 올려주세요.</p>
                </div>
              </label>
            )}
            <input
              type='file'
              id='goods-image'
              accept='image/*'
              className='hidden'
              onChange={(event) => selectGoodsImage(event.target.files[0])}
            />
          </div>
          {/* 굿즈 정보 */}
          <div className='flex grow flex-col gap-8'>
            {/* 웹툰명 */}
            <div className='flex flex-col gap-1'>
              <label className='text-lg'>웹툰명</label>
              <div className='bg-text/30 border-text rounded-lg border p-3'>
                <input
                  type='text'
                  className='w-full'
                  disabled
                  value={webtoonName}
                />
              </div>
            </div>
            {/* 굿즈명 */}
            <div className='flex flex-col gap-1'>
              <label className='text-lg' htmlFor='goods-name'>
                굿즈명
              </label>
              <div className='bg-text/30 border-text flex gap-1 rounded-lg border p-3'>
                <input
                  type='text'
                  id='goods-name'
                  className='grow focus:outline-none'
                  value={goodsName}
                  onChange={(event) => setGoodsName(event.target.value)}
                  maxLength={50}
                />
                <span className='text-text/75'>{goodsName.length} / 50</span>
              </div>
            </div>
            {/* 굿즈 설명 */}
            <div className='flex flex-col gap-1'>
              <label htmlFor='goods-description' className='text-lg'>
                굿즈 설명
              </label>
              <div className='bg-text/30 border-text flex flex-col gap-1 rounded-lg border p-3'>
                <textarea
                  id='goods-description'
                  className='h-[150px] w-full resize-none focus:outline-none'
                  value={goodsDescription}
                  onChange={(event) => setGoodsDescription(event.target.value)}
                  maxLength={255}
                ></textarea>
                <p className='text-text/75 text-end'>
                  {goodsDescription.length} / 255
                </p>
              </div>
            </div>
            {/* 주의사항 */}
            <div className='flex flex-col gap-1'>
              <h2 className='text-lg'>주의사항</h2>
              <p className='text-text/75'>
                불법 촬영 콘텐츠, 저작권 위반 콘텐츠 등을 게시하는 경우 체인툰은
                한국 전기통신사업법 제22-5(1)조에 따라 해당 콘텐츠의 액세스를
                삭제하거나 차단할 수 있으며, 사용자는 관련 법률 및 규정에 따라
                처벌을 받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
        {/* 등록 버튼 */}
        <button
          className='bg-chaintoon h-[45px] w-full cursor-pointer rounded-lg text-black'
          onClick={createGoods}
        >
          등록하기
        </button>
      </div>
    </div>
  )
}

export default MyWebtoonGoodsCreate
