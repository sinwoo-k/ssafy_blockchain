import React, { useEffect, useState } from 'react'
import { getWebtoon } from '../../api/webtoonAPI'

const RecommendWebtoonCard = ({ webtoonId }) => {
  const [webtoon, setWebtoon] = useState()

  const getData = async () => {
    try {
      const result = await getWebtoon(webtoonId)
      setWebtoon(result)
    } catch (error) {
      console.error('웹툰 조회 실패: ', error)
    }
  }
  useEffect(() => {
    if (webtoonId) getData()
  }, [webtoonId])
  return (
    <div className='flex w-full flex-col gap-5 rounded-lg bg-black/75 p-5'>
      <div className='flex w-full gap-5'>
        {/* 웹툰 이미지 */}
        <div>
          <img
            src={webtoon?.garoThumbnail}
            alt={`${webtoon?.webtoonName} 가로 썸네일`}
            className='h-[200px] w-[300px] rounded-lg object-cover'
          />
        </div>
        {/* 웹툰 정보 */}
        <div className='flex flex-col gap-2'>
          <p className='text-chaintoon text-xl'>{webtoon?.webtoonName}</p>
          <p className='text-lg'>{webtoon?.writer}</p>
          <p className='text-lg'>{webtoon?.genre}</p>
          <p>{webtoon?.summary}</p>
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
    </div>
  )
}

export default RecommendWebtoonCard
