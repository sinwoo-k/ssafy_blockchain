import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootPage from '../pages/RootPage'
import Loader from '../components/common/Loader'

// 웹툰 section
const WebtoonMain = lazy(() => import('../pages/webtoon/WebtoonMain'))
const WebtoonDetail = lazy(() => import('../pages/webtoon/WebtoonDetail'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      // 웹툰 관련
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
    ],
  },
])
export default router
