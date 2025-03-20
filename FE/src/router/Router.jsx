import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootPage from '../pages/RootPage'
import Loader from '../components/common/Loader'

// 웹툰 section
const WebtoonMain = lazy(() => import('../pages/webtoon/WebtoonMain'))
const WebtoonDetail = lazy(() => import('../pages/webtoon/WebtoonDetail'))
const WebtoonEpisode = lazy(() => import('../pages/webtoon/WebtoonEpisode'))

// 내 작품 목록 section
const MyWorks = lazy(() => import('../pages/myworks/MyWorks'))
const MyWebtoon = lazy(() => import('../pages/myworks/MyWebtoon'))

// 마이페이지 section
const MyPage = lazy(() => import('../pages/mypage/Mypage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      // 웹툰 section
      {
        path: '',
        element: (
          <Suspense fallback={<Loader />}>
            <WebtoonMain />
          </Suspense>
        ),
      },
      {
        path: '/webtoon/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <WebtoonDetail />
          </Suspense>
        ),
      },
      {
        path: '/webtoon/episode/:episodeId',
        element: (
          <Suspense fallback={<Loader />}>
            <WebtoonEpisode />
          </Suspense>
        ),
      },
      // 내 작품 목록 section
      {
        path: '/myworks',
        element: (
          <Suspense fallback={<Loader />}>
            <MyWorks />
          </Suspense>
        ),
        children: [
          {
            path: 'webtoon',
            element: (
              <Suspense fallback={<Loader />}>
                <MyWebtoon />
              </Suspense>
            ),
          },
        ],
      },
      // 마이페이지 section
      {
        path: 'mypage',
        element: (
          <Suspense fallback={<Loader />}>
            <MyPage />
          </Suspense>
        ),
      },
    ],
  },
])
export default router
