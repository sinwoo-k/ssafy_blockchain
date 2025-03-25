import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import WebtoonViewerNavBar from '../../components/webtoon/WebtoonViewerNavBar'
import WebtoonViewer from '../../components/webtoon/WebtoonViewer'
import WebtoonEpisodeComment from '../../components/webtoon/WebtoonEpisodeComment'
import WebtoonEpisodeUtility from '../../components/webtoon/WebtoonEpisodeUtility'
import { getEpisode } from '../../utils/api/webtoonAPI'

const dummyData = {
  title: '테스트 에피소드',
  webtoon: '웹툰',
  images: [
    'https://picsum.photos/600/800.jpg?ramdom=1',
    'https://picsum.photos/600/800.jpg?ramdom=2',
    'https://picsum.photos/600/800.jpg?ramdom=3',
    'https://picsum.photos/600/800.jpg?ramdom=4',
    'https://picsum.photos/600/800.jpg?ramdom=5',
    'https://picsum.photos/600/800.jpg?ramdom=6',
    'https://picsum.photos/600/800.jpg?ramdom=7',
    'https://picsum.photos/600/800.jpg?ramdom=8',
    'https://picsum.photos/600/800.jpg?ramdom=9',
  ],
  writerComment: '.',
  rating: 10.0,
}

const WebtoonEpisode = () => {
  const params = useParams()

  // 에피소드 데이터
  const [episode, setEpisode] = useState(dummyData)

  // 뷰어 내비게이션 show
  const [navbarShow, setNavbarShow] = useState(true)

  // 웹툰 뷰어 observer
  const { ref, inView, entry } = useInView({
    threshold: 0.01,
    onChange: (inView) => {
      if (!inView)
        // 벗어나면 true
        setNavbarShow(true)
    },
  })
  // 스크롤 이벤트
  const handleScroll = () => {
    const scrollTop = window.scrollY
    if (scrollTop === 0) {
      setNavbarShow(true)
      return
    }
    setNavbarShow(false)
  }
  // 뷰어 클릭시 내비바 보이기
  const handleClickViewer = () => {
    const scrollTop = window.scrollY
    if (scrollTop !== 0) {
      setNavbarShow(!navbarShow)
    }
  }

  const getData = async () => {
    try {
      const data = await getEpisode(params.episodeId)
      console.log(data)
    } catch (error) {
      console.error('회차 불러오기 실패: ', error)
    }
  }
  useEffect(() => {
    getData()
  }, [])
  useEffect(() => {
    // mount
    if (inView) {
      window.addEventListener('scroll', handleScroll)
    } else {
      window.removeEventListener('scroll', handleScroll)
    }
    // unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [inView])

  return (
    <div className='relative py-[60px]'>
      {/* 웹툰 내비바 */}
      {navbarShow && (
        <WebtoonViewerNavBar title={episode.title} webtoon={episode.webtoon} />
      )}
      {/* 웹툰 뷰어 */}
      <div ref={ref} className='mb-24'>
        <WebtoonViewer
          handleClickViewer={handleClickViewer}
          images={episode.images}
        />
      </div>
      {/* 유틸 기능 */}
      <WebtoonEpisodeUtility
        writerComment={episode.writerComment}
        rating={episode.rating}
      />
      {/* 댓글 */}
      <WebtoonEpisodeComment />
    </div>
  )
}

export default WebtoonEpisode
