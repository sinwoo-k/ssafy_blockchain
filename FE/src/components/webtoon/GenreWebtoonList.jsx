import React, { useEffect, useState } from 'react'
import { getGenreWebtoons } from '../../api/webtoonAPI'
import GenreWebtoonCard from './GenreWebtoonCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'

const GenreWebtoonList = ({ genre }) => {
  const [webtoons, setWebtoons] = useState([])
  const getData = async () => {
    try {
      const result = await getGenreWebtoons(genre)
      console.log(result)
      setWebtoons(result)
    } catch (error) {
      console.error('')
    }
  }
  useEffect(() => {
    getData()
  }, [genre])
  return (
    <div className='flex justify-center py-5'>
      {webtoons.length === 0 ? (
        <div className='flex h-[166px] w-full flex-col items-center justify-center gap-3'>
          <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
          <p className='text-xl'>{genre}의 웹툰이 없습니다.</p>
        </div>
      ) : (
        <div className='grid grid-cols-5 gap-3'>
          {webtoons.map((webtoon) => (
            <GenreWebtoonCard key={webtoon.webtoonId} webtoon={webtoon} />
          ))}
        </div>
      )}
    </div>
  )
}

export default GenreWebtoonList
