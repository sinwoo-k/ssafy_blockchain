import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootPage from '../pages/RootPage'
import Loader from '../components/common/Loader'
import CollectionPage from '../pages/store/CollectionPage'

// 웹툰 section
const WebtoonMain = lazy(() => import('../pages/webtoon/WebtoonMain'))
const WebtoonDetail = lazy(() => import('../pages/webtoon/WebtoonDetail'))
const WebtoonEpisode = lazy(() => import('../pages/webtoon/WebtoonEpisode'))

// 내 작품 목록 section
const MyWorks = lazy(() => import('../pages/myworks/MyWorks'))
const MyWebtoon = lazy(() => import('../pages/myworks/MyWebtoon'))
const MyWebtoonCreate = lazy(() => import('../pages/myworks/MyWebtoonCreate'))
const MyWebtoonDetail = lazy(() => import('../pages/myworks/MyWebtoonDetail'))
const MyWebtoonUpdate = lazy(() => import('../pages/myworks/MyWebtoonUpdate'))

// 마이페이지 section
const MyPage = lazy(() => import('../pages/mypage/Mypage'))

// 스토어 추가
const StoreMain = lazy(() => import('../pages/store/StoreMain'))
const ProductDetail = lazy(() => import('../pages/store/ProductDetail'))

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
          {
            path: 'webtoon/create',
            element: (
              <Suspense fallback={<Loader />}>
                <MyWebtoonCreate />
              </Suspense>
            ),
          },
          {
            path: 'webtoon/:id',
            element: (
              <Suspense fallback={<Loader />}>
                <MyWebtoonDetail />
              </Suspense>
            ),
          },
          {
            path: 'webtoon/:id/update',
            element: (
              <Suspense fallback={<Loader />}>
                <MyWebtoonUpdate />
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
      // store section
      {
        path: '/store',
        element: (
          <Suspense fallback={<Loader />}>
            <StoreMain />
          </Suspense>
        ),
      },
      {
        path: '/store/product/:productId',
        element: (
          <Suspense fallback={<Loader />}>
            <ProductDetail />
          </Suspense>
        ),
      },
      {
        path: '/store/collection/:collectionId',
        element: (
          <Suspense fallback={<Loader />}>
            <CollectionPage />
          </Suspense>
        ),
      },
    ],
  },
])
export default router
