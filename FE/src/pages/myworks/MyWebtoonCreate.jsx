import React, { useRef, useState } from 'react'
import MyWebtoonImageCropModal from '../../components/myworks/MyWebtoonImageCropModal'

// 아이콘
import CloseIcon from '@mui/icons-material/Close'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

const MyWebtoonCreate = () => {
  const [webtoonName, setWebtoonName] = useState('') // 웹툰명
  const genreList = [
    '판타지',
    '로맨스',
    '액션',
    '일상',
    '스릴러',
    '개그',
    '무협/사극',
    '드라마',
    '감성',
    '스포츠',
  ]
  const [genre, setGenre] = useState('') // 장르
  const [tags, setTags] = useState([]) // 태그
  const [summary, setSummary] = useState('') // 줄거리
  const [garoImage, setGaroImage] = useState(null) // 가로형 이미지
  const garoImageRef = useRef(null)
  const [showGaroImageModal, setShowGaroImageModal] = useState(false)
  const [seroImage, setSeroImage] = useState(null) // 세로형 이미지
  const seroImageRef = useRef(null)
  const [tempImage, setTempImage] = useState(null) // 등록 전 이미지
  const [showSeroImageModal, setShowSeroImageModal] = useState(false)
  const [adaptable, setAdaptable] = useState(false) // 팬아트 허용
  const [confirmAgreement, setConfirmAgreement] = useState(false) // 약관동의

  // 태그 등록 함수
  const handleTags = (event) => {
    event.preventDefault()
    if (event.key === 'Enter') {
      setTags([...tags, event.target.value])
      event.target.value = ''
    }
    if (event.target.value === '' && event.key === 'Backspace') {
      setTags(tags.slice(0, tags.length - 1))
    }
  }
  // 태그 삭제 함수
  const deleteTag = (value, index) => {
    const temp = tags.filter((v, i) => v !== value || i !== index)
    setTags(temp)
  }
  // 이미지 파일 선택시
  const changeImageInput = (image, type) => {
    setTempImage(image)
    if (type === 'garo') {
      setShowGaroImageModal(true)
      garoImageRef.current.value = ''
    } else if (type === 'sero') {
      setShowSeroImageModal(true)
      seroImageRef.current.value = ''
    }
  }
  // 이미지 input 열기
  const handleImageInput = (type) => {
    if (type === 'garo') {
      garoImageRef.current.click()
    } else if (type === 'sero') {
      seroImageRef.current.click()
    }
  }

  const submitWebtoonForm = (event) => {
    event.preventDefault()
    if (webtoonName.trim() === '') {
      alert('웹툰명을 입력해주세요.')
    } else if (genre === '') {
      alert('장르를 선택해주세요.')
    } else if (tags.length === 0) {
      alert('태그를 1개 이상 입력해주세요.')
    } else if (summary.trim() === '') {
      alert('줄거리를 입력해주세요.')
    } else if (garoImage === null || seroImage === null) {
      alert('이미지를 등록해주세요.')
    } else if (!confirmAgreement) {
      alert('약관에 동의해주세요.')
    } else {
      const payload = {
        webtoonName: webtoonName,
        genre: genre,
        tags: tags,
        summary: summary,
        adaptable: adaptable ? 'Y' : 'N',
      }
      console.log(payload)
    }
  }
  return (
    <div className='flex justify-center py-[60px]'>
      <div className='w-[1000px] py-20'>
        <h1 className='mb-15 text-xl'>신규 웹툰 등록</h1>
        <div className='flex flex-col gap-10'>
          {/* 웹툰 명 */}
          <div className='flex gap-3'>
            <label
              htmlFor='title-input'
              className='h-[48px] w-[135px] flex-none text-lg/[48px]'
            >
              웹툰명
            </label>
            <div className='bg-text/30 flex grow gap-1 rounded-lg border p-3'>
              <input
                type='text'
                id='title-input'
                className='placeholder:text-text/75 grow focus:outline-none'
                value={webtoonName}
                onChange={(event) => setWebtoonName(event.target.value)}
                maxLength={50}
                placeholder='웹툰명을 입력해주세요.'
              />
              <span className='w-[55px] flex-none text-end'>
                {webtoonName.length} / 50
              </span>
            </div>
          </div>
          {/* 장르 */}
          <div className='flex gap-3'>
            <label
              htmlFor='genre-select'
              className='h-[48px] w-[135px] flex-none text-lg/[48px]'
            >
              장르
            </label>
            <div
              className={`${genre === '' && 'text-text/75'} bg-text/30 grow rounded-lg border px-3`}
            >
              <select
                id='genre-select'
                value={genre}
                className='h-full w-full focus:outline-none'
                onChange={(event) => setGenre(event.target.value)}
              >
                <option value='' disabled hidden className='text-black'>
                  장르를 선택해주세요.
                </option>
                {genreList.map((v, i) => (
                  <option value={v} key={`genre-${i}`} className='bg-black'>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* 태그 */}
          <div className='flex gap-3'>
            <label
              htmlFor='tag-input'
              className='h-[48px] w-[135px] flex-none text-lg/[48px]'
            >
              태그
            </label>
            <div className='flex grow flex-col gap-3'>
              <div className='bg-text/30 flex w-full flex-wrap gap-1 rounded-lg border p-3'>
                {tags.map((v, i) => (
                  <div
                    key={`tag-${v}-${i}`}
                    className='bg-chaintoon/50 rounded px-1.5'
                  >
                    <span>{v}</span>
                    <button
                      className='cursor-pointer text-red-600'
                      onClick={() => deleteTag(v, i)}
                    >
                      <CloseIcon sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                ))}
                <input
                  type='text'
                  id='tag-input'
                  className='placeholder:text-text/75 grow focus:outline-none'
                  placeholder={
                    tags.length === 0
                      ? '엔터키를 입력하시면 태그가 등록됩니다.'
                      : ''
                  }
                  onKeyUp={handleTags}
                />
                <span className='w-[55px] flex-none text-end'>
                  {tags.length} / 10
                </span>
              </div>
              <p className='text-text/50'>
                태그는 최대 10개까지 등록이 가능합니다.
                <br />
                원하는 태그 입력 후 엔터키를 누르면 등록이 됩니다.
              </p>
            </div>
          </div>
          {/* 줄거리 */}
          <div className='flex gap-3'>
            <label
              htmlFor='summary-textarea'
              className='h-[48px] w-[135px] flex-none text-lg/[48px]'
            >
              줄거리
            </label>
            <div className='bg-text/30 grow rounded-lg border p-3'>
              <textarea
                id='summary-textarea'
                className='placeholder:text-text/75 h-[150px] w-full resize-none focus:outline-none'
                maxLength={500}
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder='줄거리를 작성해주세요.'
              ></textarea>
              <p className='text-end'>{summary.length} / 500</p>
            </div>
          </div>
          {/* 대표 이미지 */}
          <div className='flex gap-3'>
            <label className='h-[48px] w-[135px] flex-none text-lg/[48px]'>
              대표 이미지
            </label>
            <div className='flex gap-10'>
              <div>
                <p className='px-2'>포스터형 (200x300)</p>
                <div
                  className='bg-text/30 h-[300px] w-[200px] overflow-hidden rounded-lg border'
                  onClick={() => handleImageInput('sero')}
                >
                  {seroImage && (
                    <img
                      src={URL.createObjectURL(seroImage)}
                      alt='세로 이미지'
                      className='h-[300px] w-[200px]'
                    />
                  )}
                  <input
                    type='file'
                    accept='image/jpeg, image/jpg'
                    onChange={(event) =>
                      changeImageInput(event.target.files[0], 'sero')
                    }
                    className='hidden'
                    ref={seroImageRef}
                  />
                  {showSeroImageModal && (
                    <MyWebtoonImageCropModal
                      image={tempImage}
                      setImage={setSeroImage}
                      setShowModal={setShowSeroImageModal}
                      width={2}
                      height={3}
                    />
                  )}
                </div>
              </div>
              <div>
                <p className='px-2'>가로형 (400 x 300)</p>
                <div
                  className='bg-text/30 h-[300px] w-[400px] overflow-hidden rounded-lg border'
                  onClick={() => handleImageInput('garo')}
                >
                  {garoImage && (
                    <img
                      src={URL.createObjectURL(garoImage)}
                      alt='가로 이미지'
                      className='h-[300px] w-[400px]'
                    />
                  )}
                  <input
                    type='file'
                    accept='image/jpeg, image/jpg'
                    onChange={(event) =>
                      changeImageInput(event.target.files[0], 'garo')
                    }
                    className='hidden'
                    ref={garoImageRef}
                  />
                  {showGaroImageModal && (
                    <MyWebtoonImageCropModal
                      image={tempImage}
                      setImage={setGaroImage}
                      setShowModal={setShowGaroImageModal}
                      width={4}
                      height={3}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* 팬아트 허용 */}
          <div className='flex gap-3'>
            <label className='h-[48px] w-[135px] flex-none text-lg/[48px]'>
              팬아트 허용
            </label>
            <div className='flex h-[48px] items-center'>
              {adaptable ? (
                <div onClick={() => setAdaptable(false)}>
                  <CheckBoxIcon
                    sx={{ fontSize: 40 }}
                    className='text-chaintoon cursor-pointer'
                  />
                </div>
              ) : (
                <div onClick={() => setAdaptable(true)}>
                  <CheckBoxOutlineBlankIcon
                    sx={{ fontSize: 40 }}
                    className='cursor-pointer'
                  />
                </div>
              )}
            </div>
          </div>
          {/* 약관 동의 */}
          <div>
            <p>
              저작권 등 다른 사람의 권리를 침해하거나 명예를 훼손하는 게시물은
              이용약관 및 관련 법률에 의해 제재를 받으실 수 있습니다.
              <br />
              성인물, 폭력물 등의 게시물은 통보없이 삭제될 수 있습니다.
            </p>
            <div className='flex items-center gap-3'>
              <div className='flex h-[48px] items-center'>
                {confirmAgreement ? (
                  <div onClick={() => setConfirmAgreement(false)}>
                    <CheckBoxIcon
                      sx={{ fontSize: 40 }}
                      className='text-chaintoon cursor-pointer'
                    />
                  </div>
                ) : (
                  <div onClick={() => setConfirmAgreement(true)}>
                    <CheckBoxOutlineBlankIcon
                      sx={{ fontSize: 40 }}
                      className='cursor-pointer'
                    />
                  </div>
                )}
              </div>
              <p className='text-lg'>동의합니다.</p>
            </div>
          </div>
          <div className='w-full'>
            <button
              className='bg-chaintoon h-[45px] w-full cursor-pointer rounded-lg text-black'
              onClick={submitWebtoonForm}
            >
              등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyWebtoonCreate
