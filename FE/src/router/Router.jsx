import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootPage from '../pages/RootPage'
import Loader from '../components/common/Loader'
import CollectionPage from '../pages/store/CollectionPage'

// 웹툰 section
const WebtoonMain = lazy(() => import('../pages/webtoon/WebtoonMain'))
const WebtoonDetail = lazy(() => import('../pages/webtoon/WebtoonDetail'))
const WebtoonEpisode = lazy(() => import('../pages/webtoon/WebtoonEpisode'))

// 마이페이지 section
const MyPage = lazy(() => import('../pages/mypage/Mypage'))

// 스토어 추가
const StoreMain = lazy(() => import('../pages/store/StoreMain'))
const ProductDetail = lazy(()=> import('../pages/store/ProductDetail'))

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
      // 마이페이지 section
      {
        path: 'mypage',
        element: (
          <Suspense fallback={<Loader />}>
            <MyPage />
          </Suspense>
        ),
      },
      {
        path : '/store',
        element:(
          <Suspense fallback={<Loader />}>
            <StoreMain />
          </Suspense>
        )
      },
      {
        path : '/store/product/:productId',
        element:(
          <Suspense fallback={<Loader />}>
            <ProductDetail />
          </Suspense>
        )
      },
      {
        path : '/store/collection/:collectionId',
        element:(
          <Suspense fallback={<Loader />}>
            <CollectionPage />
          </Suspense>
        )
      },
    ],
  },
])
export default router
