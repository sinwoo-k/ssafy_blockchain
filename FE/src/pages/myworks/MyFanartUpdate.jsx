import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../components/common/Loader'

// 아이콘
import UploadFileIcon from '@mui/icons-material/UploadFile'
import ClearIcon from '@mui/icons-material/Clear'
import { getFanart, patchFanart } from '../../api/fanartAPI'

const MyFanartUpdate = () => {
  const params = useParams()
  const navigate = useNavigate()

  const [fanartImage, setFanartImage] = useState(null) // 팬아트 이미지
  const [fanartImageURL, setFanartImageURL] = useState('')
  const [webtoonName, setWeboonName] = useState('') // 웹툰명
  const [webtoonId, setWebtoonId] = useState(null) // 웹툰id
  const [fanartName, setFanartName] = useState('') // 팬아트명
  const [fanartDescription, setFanartDescription] = useState('') // 팬아트 설명

  const [isLoading, setIsLoading] = useState(false)

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
      setFanartImage(file)
    }
  }

  const selectFanartImage = (file) => {
    setFanartImage(file)
    setFanartImageURL(URL.createObjectURL(file))
  }

  const clearFanartImage = () => {
    setFanartImage(null)
    setFanartImageURL('')
  }

  const getData = async () => {
    try {
      const result = await getFanart(params.fanartId)
      console.log(result)
      setWeboonName(result.webtoonName)
      setFanartImageURL(result.fanartImage)
      setWebtoonId(result.webtoonId)
      setFanartName(result.fanartName)
      setFanartDescription(result.description || '')
    } catch (error) {
      console.error('팬아트 상세 조회 실패: ', error)
    }
  }

  // 팬아트 수정 함수
  const updateFanart = async () => {
    if (fanartImage === null && fanartImageURL === '') {
      alert('팬아트를 등록해주세요.')
      return
    }
    if (fanartName.trim() === '') {
      alert('팬아트명을 작성해주세요.')
      return
    }
    if (fanartDescription.trim() === '') {
      alert('팬아트 설명을 작성해주세요.')
      return
    }

    const payload = {
      webtoonId: webtoonId,
      fanartName: fanartName,
      description: fanartDescription,
    }
    setIsLoading(true)
    try {
      const result = await patchFanart(params.fanartId, payload, fanartImage)
      navigate('/myworks/fanart')
    } catch (error) {
      console.error('팬아트 수정 실패: ', error)
      alert('팬아트 정보 수정에 실패하였습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // mount
    getData()
    // unmount
    return () => {}
  }, [])

  return (
    <div className='flex justify-center pt-[60px]'>
      <div className='w-[1000px] pt-15'>
        <h1 className='mb-8 text-xl'>팬아트 수정하기</h1>
        <div className='mb-8 flex gap-10'>
          {/* 팬아트 이미지 */}
          <div className='flex-none'>
            {fanartImageURL !== '' ? (
              <div className='relative'>
                <img
                  src={fanartImageURL}
                  alt='업로드 팬아트 이미지'
                  className='h-[600px] w-[450px] rounded-lg object-cover'
                />
                <button
                  className='absolute right-2 bottom-2'
                  onClick={clearFanartImage}
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
                htmlFor='fanart-image'
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
                  <p>팬아트를 선택하거나 올려주세요.</p>
                </div>
              </label>
            )}
            <input
              type='file'
              id='fanart-image'
              accept='image/*'
              className='hidden'
              onChange={(event) => selectFanartImage(event.target.files[0])}
            />
          </div>
          {/* 팬아트 정보 */}
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
            {/* 팬아트명 */}
            <div className='flex flex-col gap-1'>
              <label className='text-lg' htmlFor='fanart-name'>
                팬아트명
              </label>
              <div className='bg-text/30 border-text flex gap-1 rounded-lg border p-3'>
                <input
                  type='text'
                  id='fanart-name'
                  className='grow focus:outline-none'
                  value={fanartName}
                  onChange={(event) => setFanartName(event.target.value)}
                  maxLength={50}
                />
                <span className='text-text/75'>{fanartName.length} / 50</span>
              </div>
            </div>
            {/* 팬아트 설명 */}
            <div className='flex flex-col gap-1'>
              <label htmlFor='fanart-description' className='text-lg'>
                팬아트 설명
              </label>
              <div className='bg-text/30 border-text flex flex-col gap-1 rounded-lg border p-3'>
                <textarea
                  id='fanart-description'
                  className='h-[150px] w-full resize-none focus:outline-none'
                  value={fanartDescription}
                  onChange={(event) => setFanartDescription(event.target.value)}
                  maxLength={255}
                ></textarea>
                <p className='text-text/75 text-end'>
                  {fanartDescription.length} / 255
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
          onClick={updateFanart}
        >
          수정하기
        </button>
      </div>
      {isLoading && <Loader />}
    </div>
  )
}

export default MyFanartUpdate
