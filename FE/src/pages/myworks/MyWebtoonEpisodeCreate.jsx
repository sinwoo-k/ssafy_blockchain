import React, { useRef, useState } from 'react'
import MyWebtoonImageCropModal from '../../components/myworks/MyWebtoonImageCropModal'

// 아이콘
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import MyWebtoonEpisodePreview from '../../components/myworks/MyWebtoonEpisodePreview'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

const MyWebtoonEpisodeCreate = () => {
  const [episodeName, setEpisodeName] = useState('') // 회차명
  const [thumbnail, setThumbnail] = useState(null) // 썸네일
  const thumbnailRef = useRef(null)
  const [tempImage, setTempImage] = useState(null)
  const [showThumbnailModal, setShowThumbnailModal] = useState(false)
  const [episodeImages, setEpisodeImages] = useState([]) // 에피소드 이미지
  const episodeImageRef = useRef(null)
  const [selectEpisodeImage, setSelectEpisodeImage] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [writerComment, setWriterComment] = useState('') // 작가의 말
  const [commentable, setCommentable] = useState(false) // 댓글 허용 여부

  // 썸네일 관련 함수
  // 이미지 파일 선택시
  const changeImageInput = (image) => {
    setTempImage(image)
    setShowThumbnailModal(true)
    thumbnailRef.current.value = ''
  }

  // 에피소드 이미지 관련 함수
  // 에피소드 이미지 등록
  const changeEpisodeImageInput = (event) => {
    const tempImages = Array.from(event.target.files).map((file) => {
      return { name: file.name, file: file }
    })
    setEpisodeImages(tempImages)
    setSelectEpisodeImage({ name: tempImages[0].name, index: 0 })
    episodeImageRef.current.value = ''
  }
  // 이미지 올리기
  const imageUp = (index) => {
    const newImages = [...episodeImages]
    if (index !== 0) {
      let temp = newImages[index]
      newImages[index] = newImages[index - 1]
      newImages[index - 1] = temp
      setEpisodeImages(newImages)
      setSelectEpisodeImage({
        name: selectEpisodeImage.name,
        index: selectEpisodeImage.index - 1,
      })
    }
  }
  // 이미지 내리기
  const imageDown = (index) => {
    const newImages = [...episodeImages]
    if (index !== newImages.length - 1) {
      let temp = newImages[index]
      newImages[index] = newImages[index + 1]
      newImages[index + 1] = temp
      setEpisodeImages(newImages)
      setSelectEpisodeImage({
        name: selectEpisodeImage.name,
        index: selectEpisodeImage.index + 1,
      })
    }
  }
  // 이미지 삭제하기
  const imageDelete = (index) => {
    const newImages = episodeImages.filter((_, i) => i !== index)
    setEpisodeImages(newImages)
    setSelectEpisodeImage({
      name: newImages[0].name,
      index: 0,
    })
  }

  // 회차 등록 함수
  const submitEpisodeForm = (event) => {
    event.preventDefault()
    if (episodeName.trim() === '') {
      alert('회차명을 작성해주세요.')
    } else if (thumbnail === null) {
      alert('썸네일을 등록해주세요.')
    } else if (episodeImages.length === 0) {
      alert('원고를 등록해주세요.')
    } else if (writerComment.trim() === '') {
      alert('작가의 말을 작성해주세요.')
    } else {
      const payload = {
        episodeName: episodeName,
        writerComment: writerComment,
        commentable: commentable ? 'Y' : 'N',
      }
      console.log(payload)
    }
  }
  return (
    <div className='flex justify-center py-[60px]'>
      <div className='w-[1000px] py-20'>
        <h1 className='mb-15 text-xl'>신규 회차 등록</h1>
        <div className='flex flex-col gap-10'>
          {/* 회차명 */}
          <div className='flex gap-3'>
            <label
              htmlFor='title-input'
              className='h-[48px] w-[135px] flex-none text-lg/[48px]'
            >
              회차명
            </label>
            <div className='bg-text/50 flex grow gap-1 rounded-lg border p-3'>
              <input
                type='text'
                id='title-input'
                className='placeholder:text-text/75 grow focus:outline-none'
                value={episodeName}
                onChange={(event) => setEpisodeName(event.target.value)}
                maxLength={50}
                placeholder='회차명을 입력해주세요.'
              />
              <span className='w-[55px] flex-none text-end'>
                {episodeName.length} / 50
              </span>
            </div>
          </div>
          {/* 썸네일 */}
          <div className='flex gap-3'>
            <label className='h-[48px] w-[135px] flex-none text-lg/[48px]'>
              썸네일
            </label>
            <div className='flex flex-col gap-3'>
              <div
                className='bg-text/50 flex h-[150px] w-[300px] gap-1 overflow-hidden rounded-lg border'
                onClick={() => thumbnailRef.current.click()}
              >
                {thumbnail && (
                  <img src={URL.createObjectURL(thumbnail)} alt='' />
                )}
                <input
                  type='file'
                  accept='image/jpeg, image/jpg'
                  className='hidden'
                  onChange={(event) => changeImageInput(event.target.files[0])}
                  ref={thumbnailRef}
                />
                {showThumbnailModal && (
                  <MyWebtoonImageCropModal
                    image={tempImage}
                    setImage={setThumbnail}
                    setShowModal={setShowThumbnailModal}
                    width={3}
                    height={1.5}
                  />
                )}
              </div>
              <p className='text-text/50'>
                썸네일 이미지는 300x150 사이즈 입니다.
              </p>
            </div>
          </div>
          {/* 원고 등록 */}
          <div className='flex gap-3'>
            <label className='h-[48px] w-[135px] flex-none text-lg/[48px]'>
              원고 등록
            </label>
            <div className='flex flex-col gap-3'>
              <div className='flex h-[350px] w-[550px] flex-col overflow-hidden rounded-lg border bg-neutral-800'>
                <div className='bg-text/50 grow overflow-y-scroll py-2'>
                  {episodeImages.map((img, index) => (
                    <p
                      key={`episode-image-${index}`}
                      className={`${selectEpisodeImage && selectEpisodeImage.name === img.name && 'bg-chaintoon text-black'} 
                      cursor-pointer px-2`}
                      onClick={() =>
                        setSelectEpisodeImage({ name: img.name, index: index })
                      }
                    >
                      {img.name}
                    </p>
                  ))}
                </div>
                <div className='flex h-[25px] justify-between px-2'>
                  <div className='flex gap-3'>
                    <button
                      className='hover:text-chaintoon cursor-pointer'
                      onClick={() => imageUp(selectEpisodeImage.index)}
                    >
                      <ArrowDropUpIcon />
                      위로 올리기
                    </button>
                    <button
                      className='hover:text-chaintoon cursor-pointer'
                      onClick={() => imageDown(selectEpisodeImage.index)}
                    >
                      <ArrowDropDownIcon />
                      아래로 내리기
                    </button>
                    <button
                      className='cursor-pointer hover:text-red-500'
                      onClick={() => imageDelete(selectEpisodeImage.index)}
                    >
                      삭제
                    </button>
                  </div>
                  <button
                    className='hover:text-chaintoon cursor-pointer'
                    onClick={() => setShowPreviewModal(true)}
                  >
                    미리보기
                  </button>
                </div>
                {showPreviewModal && (
                  <MyWebtoonEpisodePreview
                    images={episodeImages}
                    setShowModal={setShowPreviewModal}
                  />
                )}
              </div>
              <button
                className='bg-chaintoon h-[45px] w-full cursor-pointer rounded-lg text-black'
                onClick={() => episodeImageRef.current.click()}
              >
                회차 이미지 등록하기
              </button>
              <input
                type='file'
                accept='image/*'
                multiple
                className='hidden'
                onChange={changeEpisodeImageInput}
                ref={episodeImageRef}
              />
            </div>
          </div>
          {/* 작가의 말 */}
          <div className='flex gap-3'>
            <label
              htmlFor='writer-comment-textarea'
              className='h-[48px] w-[135px] flex-none text-lg/[48px]'
            >
              작가의 말
            </label>
            <div className='bg-text/50 grow rounded-lg border p-3'>
              <textarea
                id='writer-comment-textarea'
                className='placeholder:text-text/75 h-[100px] w-full resize-none focus:outline-none'
                maxLength={500}
                value={writerComment}
                onChange={(event) => setWriterComment(event.target.value)}
                placeholder='작가의 말을 작성해주세요.'
              ></textarea>
              <p className='text-end'>{writerComment.length} / 250</p>
            </div>
          </div>
          {/* 댓글 허용 */}
          <div className='flex gap-3'>
            <label className='h-[48px] w-[135px] flex-none text-lg/[48px]'>
              댓글 허용
            </label>
            <div className='flex h-[48px] items-center'>
              {commentable ? (
                <div onClick={() => setCommentable(false)}>
                  <CheckBoxIcon
                    sx={{ fontSize: 40 }}
                    className='text-chaintoon cursor-pointer'
                  />
                </div>
              ) : (
                <div onClick={() => setCommentable(true)}>
                  <CheckBoxOutlineBlankIcon
                    sx={{ fontSize: 40 }}
                    className='cursor-pointer'
                  />
                </div>
              )}
            </div>
          </div>
          <div className='w-full'>
            <button
              className='bg-chaintoon h-[45px] w-full cursor-pointer rounded-lg text-black'
              onClick={submitEpisodeForm}
            >
              등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyWebtoonEpisodeCreate
