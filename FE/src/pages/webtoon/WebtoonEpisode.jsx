import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import WebtoonViewerNavBar from '../../components/webtoon/WebtoonViewerNavBar'
import WebtoonViewer from '../../components/webtoon/WebtoonViewer'
import WebtoonEpisodeUtility from '../../components/webtoon/WebtoonEpisodeUtility'
import { getEpisode, getWebtoon } from '../../api/webtoonAPI'
import CommentList from '../../components/comment/CommentList'
import ScrollButtons from '../../components/common/ScrollButtons'

/** 스크롤 위치, 만료시간 저장 */
const setWithExpiry = (key, value, ttl) => {
  const now = new Date()
  const item = {
    value,
    expiry: now.getTime() + ttl,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

/** 스크롤 위치 만료시간 체크 */
const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key)
  if (!itemStr) return null
  const item = JSON.parse(itemStr)
  const now = new Date()
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key)
    return null
  }
  return item.value
}

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000

const WebtoonEpisode = () => {
  const params = useParams()
  const navigate = useNavigate()

  // 에피소드 데이터
  const [episode, setEpisode] = useState([])
  const [webtoonName, setWebtoonName] = useState()
  const [commentCount, setCommentCount] = useState(0)

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
    setWithExpiry(`scroll-position-${params.episodeId}`, scrollTop, ONE_WEEK)
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
      const result = await getEpisode(params.episodeId)
      setEpisode(result)
      setCommentCount(result.commentCount)
      const webtoonNameResult = await getWebtoon(result.webtoonId)
      setWebtoonName(webtoonNameResult.webtoonName)
    } catch (error) {
      console.error('회차 불러오기 실패: ', error)
      navigate('/error', { state: { message: error.response.data.message } })
    }
  }
  useEffect(() => {
    getData().then((res) => {
      const savedPosition = getWithExpiry(`scroll-position-${params.episodeId}`)
      if (savedPosition !== null) {
        window.scrollTo({
          top: Number(savedPosition),
          behavior: 'smooth',
        })
      }
    })
  }, [params.episodeId])

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
        <WebtoonViewerNavBar
          title={episode.episodeName}
          webtoonId={episode.webtoonId}
          webtoonName={webtoonName}
          prevEpisode={episode.previousEpisodeId}
          nextEpisode={episode.nextEpisodeId}
        />
      )}
      {/* 웹툰 뷰어 */}
      <div ref={ref} className='mb-32'>
        <WebtoonViewer
          handleClickViewer={handleClickViewer}
          images={episode.images}
        />
      </div>
      {/* 유틸 기능 */}
      <WebtoonEpisodeUtility episode={episode} />
      {/* 댓글 */}
      <CommentList
        usageId={params.episodeId}
        type={'COMMENT_EPISODE'}
        commentCount={commentCount}
        setCommentCount={setCommentCount}
      />
      <ScrollButtons entry={entry} />
    </div>
  )
}

export default WebtoonEpisode
