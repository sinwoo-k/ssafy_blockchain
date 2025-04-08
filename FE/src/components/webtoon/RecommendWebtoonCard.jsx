import React, { useEffect, useState } from 'react'
import { getWebtoon } from '../../api/webtoonAPI'
import { Link, useNavigate } from 'react-router-dom'

const RecommendWebtoonCard = ({ webtoonId }) => {
  const navigate = useNavigate()

  const [webtoon, setWebtoon] = useState()

  const getData = async () => {
    try {
      const result = await getWebtoon(webtoonId)
      setWebtoon(result)
    } catch (error) {
      console.error('웹툰 조회 실패: ', error)
      navigate('/error', { state: { message: error.response.data.message } })
    }
  }
  useEffect(() => {
    if (webtoonId) getData()
  }, [webtoonId])
  return (
    <Link
      to={`/webtoon/${webtoonId}`}
      className='flex w-full flex-col gap-5 rounded-lg bg-black/75 p-5'
    >
      <div className='flex w-full gap-5'>
        {/* 웹툰 이미지 */}
        <div className='flex-none'>
          <img
            src={webtoon?.seroThumbnail}
            alt={`${webtoon?.webtoonName} 세로 썸네일`}
            className='h-[200px] w-[150px] rounded-lg object-cover'
          />
        </div>
        {/* 웹툰 정보 */}
        <div className='flex grow flex-col gap-2'>
          <p className='text-chaintoon text-xl'>{webtoon?.webtoonName}</p>
          <p className='text-lg'>{webtoon?.writer}</p>
          <p className='text-text/75 text-lg'>{webtoon?.genre}</p>
          <p className='break-words'>{webtoon?.summary}</p>
        </div>
      </div>
      {/* 웹툰 태그 */}
      <div className='flex gap-3'>
        {webtoon?.tags.map((tag, index) => (
          <span
            key={`recommend-${index + 1}`}
            className='bg-chaintoon rounded-lg px-2 py-1'
          >
            # {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

export default RecommendWebtoonCard
