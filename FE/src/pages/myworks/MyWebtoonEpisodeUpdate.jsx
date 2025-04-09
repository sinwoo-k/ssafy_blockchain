import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MyWebtoonImageCropModal from '../../components/myworks/MyWebtoonImageCropModal'
import MyWebtoonEpisodePreview from '../../components/myworks/MyWebtoonEpisodePreview'
import { getEpisode, patchEpisode } from '../../api/webtoonAPI'
import IconButton from '../../components/common/IconButton'
import { checkWidthSize } from '../../utils/image/limiteSize'
import Loader from '../../components/common/Loader'

// 아이콘
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

const MyWebtoonEpisodeUpdate = () => {
  const params = useParams()
  const navigate = useNavigate()

  const [webtoonId, setWebtoonId] = useState('') // 웹툰 Id
  const [episodeName, setEpisodeName] = useState('') // 회차명
  const [thumbnail, setThumbnail] = useState(null) // 썸네일
  const thumbnailRef = useRef(null)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [tempImage, setTempImage] = useState(null)
  const [showThumbnailModal, setShowThumbnailModal] = useState(false)
  const [episodeImages, setEpisodeImages] = useState([]) // 에피소드 이미지
  const episodeImageRef = useRef(null)
  const [selectEpisodeImage, setSelectEpisodeImage] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [writerComment, setWriterComment] = useState('') // 작가의 말
  const [commentable, setCommentable] = useState(false) // 댓글 허용 여부

  const [isLoading, setIsLoading] = useState(false)

  // 썸네일 관련 함수
  // 이미지 파일 선택시
  const changeImageInput = (image) => {
    setTempImage(image)
    setShowThumbnailModal(true)
    thumbnailRef.current.value = ''
  }

  // 에피소드 이미지 관련 함수
  // 에피소드 이미지 등록
  const changeEpisodeImageInput = async (event) => {
    const selectIndex = episodeImages.length
    const files = Array.from(event.target.files)
    const processedFiles = await Promise.all(
      files.map((file) => checkWidthSize(690, file)),
    )
    const tempImages = processedFiles.map((file) => {
      return { name: file.name, file: file, type: 'new' }
    })
    setSelectEpisodeImage({ name: tempImages[0].name, index: selectIndex })
    setEpisodeImages((prev) => [...prev, ...tempImages])
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

  // 회차 수정 함수
  const submitEpisodeForm = async (event) => {
    event.preventDefault()
    if (episodeName.trim() === '') {
      alert('회차명을 작성해주세요.')
      return
    }
    if (thumbnail === null && !thumbnailUrl) {
      alert('썸네일을 등록해주세요.')
      return
    }
    if (episodeImages.length === 0) {
      alert('원고를 등록해주세요.')
      return
    }
    if (writerComment.trim() === '') {
      alert('작가의 말을 작성해주세요.')
      return
    }

    const payload = {
      episodeName: episodeName,
      writerComment: writerComment,
      commentable: commentable ? 'Y' : 'N',
    }
    setIsLoading(true)
    try {
      const result = await patchEpisode(
        params.episodeId,
        payload,
        thumbnail,
        episodeImages,
      )
      navigate(`/myworks/webtoon/${webtoonId}`)
    } catch (error) {
      console.error('회차 정보 수정 실패: ', error)
      alert('회차 정보 수정에 실패하였습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const getData = async () => {
    try {
      const result = await getEpisode(params.episodeId)
      console.log(result)
      setWebtoonId(result.webtoonId)
      setEpisodeName(result.episodeName)
      setWriterComment(result.writerComment)
      setCommentable(result.commentable === 'Y' ? true : false)
      setThumbnailUrl(result.thumbnail)
      setEpisodeImages(
        result.images.map((image, index) => ({
          name: `episode-image-${index + 1}`,
          file: image,
          type: 'old',
        })),
      )
    } catch (error) {
      console.error('에피소드 정보 불러오기 실패: ', error)
    }
  }

  useEffect(() => {
    // mount
    getData()
    // unmount
    return () => {}
  }, [])

  return (
    <div className='flex justify-center py-[60px]'>
      <div className='w-[1000px] py-20'>
        <h1 className='mb-15 text-xl'>회차 수정하기</h1>
        <div className='flex flex-col gap-10'>
          {/* 회차명 */}
          <div className='flex gap-3'>
            <label
              htmlFor='title-input'
              className='h-[48px] w-[135px] flex-none text-lg/[48px]'
            >
              회차명
            </label>
            <div className='bg-text/30 flex grow gap-1 rounded-lg border p-3'>
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
                className='bg-text/30 flex h-[150px] w-[300px] cursor-pointer gap-1 overflow-hidden rounded-lg border'
                onClick={() => thumbnailRef.current.click()}
              >
                {thumbnail ? (
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt='등록된 썸네일 이미지'
                  />
                ) : (
                  thumbnailUrl && (
                    <img src={thumbnailUrl} alt='기존 썸네일 이미지' />
                  )
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
            <div className='flex grow gap-3'>
              <div className='flex h-[350px] w-[450px] flex-col rounded-lg border bg-neutral-800'>
                <div className='grow overflow-hidden rounded-t-lg'>
                  <div className='bg-text/30 h-full overflow-y-scroll py-2'>
                    {episodeImages.map((img, index) => (
                      <p
                        key={`episode-image-${index}`}
                        className={`${selectEpisodeImage && selectEpisodeImage.name === img.name && 'bg-chaintoon text-black'} 
                      cursor-pointer px-2`}
                        onClick={() =>
                          setSelectEpisodeImage({
                            name: img.name,
                            index: index,
                          })
                        }
                      >
                        {img.name}
                      </p>
                    ))}
                  </div>
                </div>
                <div className='flex h-[25px] justify-between px-2'>
                  <div className='flex items-center gap-3'>
                    <div
                      className='hover:text-chaintoon'
                      onClick={() => imageUp(selectEpisodeImage.index)}
                    >
                      <IconButton
                        Icon={ArrowDropUpIcon}
                        tooltip={'위로 올리기'}
                        style={{ fontSize: 30 }}
                      />
                    </div>
                    <div
                      className='hover:text-chaintoon'
                      onClick={() => imageDown(selectEpisodeImage.index)}
                    >
                      <IconButton
                        Icon={ArrowDropDownIcon}
                        tooltip={'아래로 내리기'}
                        style={{ fontSize: 30 }}
                      />
                    </div>
                    <div
                      className='hover:text-red-500'
                      onClick={() => imageDelete(selectEpisodeImage.index)}
                    >
                      <IconButton
                        Icon={DeleteForeverIcon}
                        tooltip={'이미지 삭제'}
                        style={{ fontSize: 20 }}
                      />
                    </div>
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
              <div className='flex grow flex-col justify-end gap-5'>
                <div className='text-text/50 px-1'>
                  <p>원고는 순서대로 등록됩니다.</p>
                  <p>원고의 가로 사이즈는 690px로 제한됩니다.</p>
                  <p>원고의 세로 사이즈는 제한이 없습니다.</p>
                  <p></p>
                </div>
                <button
                  className='bg-chaintoon h-[45px] w-full cursor-pointer rounded-lg text-black'
                  onClick={() => episodeImageRef.current.click()}
                >
                  회차 이미지 등록하기
                </button>
              </div>
              <input
                type='file'
                accept='image/jpeg, image/jpg'
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
            <div className='bg-text/30 grow rounded-lg border p-3'>
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
      {isLoading && <Loader />}
    </div>
  )
}

export default MyWebtoonEpisodeUpdate
