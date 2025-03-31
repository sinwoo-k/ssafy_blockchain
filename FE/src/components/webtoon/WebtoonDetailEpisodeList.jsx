import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EpisodeCard from './EpisodeCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'
import { getEpisodeList } from '../../api/webtoonAPI'

const WebtoonDetailEpisodeList = () => {
  const [episodeData, setEpisodeData] = useState([])
  // 보여줄 에피소드 리스트
  const [episodes, setEpisodes] = useState([])

  // 정렬 버튼
  const sortEpisode = (keyword) => {
    let tempData
    if (keyword === 'first') {
      tempData = episodeData.sort((a, b) => a.episodeId - b.episodeId)
      setDummyData(tempData)
    } else {
      tempData = episodeData.sort((a, b) => b.episodeId - a.episodeId)
      setDummyData(tempData)
    }
    setEpisodes(tempData.slice(0, 10))
  }

  // 더보기 버튼
  const handleAddEpisode = () => {
    setEpisodes([
      ...episodes,
      ...episodeData.slice(episodes.length, episodes.length + 10),
    ])
  }

  const getData = async () => {
    try {
      const data = await getEpisodeList(params.webtoonId)
      setEpisodeData(data)
      setEpisodes(data.slice(0, 10))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    // mount
    getData()
    // unmount
    return () => {}
  }, [])
  return (
    <div className={`relative mb-10 flex w-full justify-center py-10`}>
      <div className='w-[1000px]'>
        {/* 정렬 버튼 */}
        <div className='mb-1 flex justify-between gap-5'>
          <p>총 {episodeData.length}화</p>
          <div className='flex gap-5'>
            <button
              className='cursor-pointer'
              onClick={() => sortEpisode('latest')}
            >
              최신화부터
            </button>
            <button
              className='cursor-pointer'
              onClick={() => sortEpisode('first')}
            >
              1화부터
            </button>
          </div>
        </div>
        <div className='flex flex-col border-t'>
          {episodes.length === 0 ? (
            <div className='flex h-[300px] w-full flex-col items-center justify-center gap-3'>
              <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
              <p className='text-xl'>등록된 에피소드가 없습니다.</p>
            </div>
          ) : (
            <>
              {episodes.map((episode) => (
                <Link
                  to={`/webtoon/episode/${episode.episodeId}`}
                  key={episode.episodeId}
                >
                  <EpisodeCard episode={episode} />
                </Link>
              ))}
              {episodes.length !== episodeData.length && (
                <div className='flex h-[80px] items-center justify-center'>
                  <button
                    className='cursor-pointer text-lg'
                    onClick={handleAddEpisode}
                  >
                    더보기
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default WebtoonDetailEpisodeList
