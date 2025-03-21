import React, { useState } from 'react'

// 아이콘
import CloseIcon from '@mui/icons-material/Close'

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

  const submitWebtoonForm = (event) => {
    event.preventDefault()
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
            <div className='bg-text/50 border-chaintoon flex grow gap-1 rounded-lg border p-3'>
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
              htmlFor=''
              className='h-[48px] w-[135px] flex-none text-lg/[48px]'
            >
              장르
            </label>
            <div
              className={`${genre === '' && 'text-text/75'} border-chaintoon bg-text/50 grow rounded-lg border px-3`}
            >
              <select
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
            <div className='bg-text/50 border-chaintoon flex grow flex-wrap gap-1 rounded-lg border p-3'>
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
                placeholder='엔터키를 입력하시면 태그가 등록됩니다.'
                onKeyUp={handleTags}
              />
              <span className='w-[55px] flex-none text-end'>
                {tags.length} / 10
              </span>
            </div>
          </div>
          {/* 줄거리 */}
          <div className='flex gap-3'>
            <label
              htmlFor=''
              className='h-[48px] w-[135px] flex-none text-lg/[48px]'
            >
              줄거리
            </label>
            <div className='bg-text/50 border-chaintoon grow rounded-lg border p-3'>
              <textarea
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
            <label
              htmlFor=''
              className='h-[48px] w-[135px] flex-none text-lg/[44px]'
            >
              대표 이미지
            </label>
          </div>
          {/* 팬아트 허용 */}
          <div className='flex gap-3'>
            <label
              htmlFor=''
              className='h-[48px] w-[135px] flex-none text-lg/[44px]'
            >
              팬아트 허용
            </label>
          </div>
          {/* 약관 동의 */}
        </div>
      </div>
    </div>
  )
}

export default MyWebtoonCreate
