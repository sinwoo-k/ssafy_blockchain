import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootPage from '../pages/RootPage'
import Loader from '../components/common/Loader'
import Page404 from '../pages/error/Page404'
import CollectionPage from '../pages/store/CollectionPage'

// Sso Callback
const SsoCallback = lazy(() => import('../components/Auth/SsoCallback'))

// 웹툰 section
const WebtoonMain = lazy(() => import('../pages/webtoon/WebtoonMain'))
const WebtoonDetail = lazy(() => import('../pages/webtoon/WebtoonDetail'))
const WebtoonEpisode = lazy(() => import('../pages/webtoon/WebtoonEpisode'))
const FavoriteWebtoon = lazy(() => import('../pages/webtoon/FavoriteWebtoon'))

// 내 작품 목록 section
const MyWorks = lazy(() => import('../pages/myworks/MyWorks'))
const MyWebtoon = lazy(() => import('../pages/myworks/MyWebtoon'))
const MyWebtoonCreate = lazy(() => import('../pages/myworks/MyWebtoonCreate'))
const MyWebtoonDetail = lazy(() => import('../pages/myworks/MyWebtoonDetail'))
const MyWebtoonUpdate = lazy(() => import('../pages/myworks/MyWebtoonUpdate'))
const MyWebtoonEpisodeCreate = lazy(
  () => import('../pages/myworks/MyWebtoonEpisodeCreate'),
)
const MyWebtoonEpisodeUpdate = lazy(
  () => import('../pages/myworks/MyWebtoonEpisodeUpdate'),
)
const MyFanart = lazy(() => import('../pages/myworks/MyFanart'))
const MyFanartUpdate = lazy(() => import('../pages/myworks/MyFanartUpdate'))
const MyWebtoonGoods = lazy(() => import('../pages/myworks/MyWebtoonGoods'))
const MyWebtoonGoodsCreate = lazy(
  () => import('../pages/myworks/MyWebtoonGoodsCreate'),
)
const MyWebtoonGoodsUpdate = lazy(
  () => import('../pages/myworks/MyWebtoonGoodsUpdate'),
)

// 마이페이지 section
const MyPage = lazy(() => import('../pages/mypage/Mypage'))

// 스토어 추가
const StoreMain = lazy(() => import('../pages/store/StoreMain'))
const ProductDetail = lazy(() => import('../pages/store/ProductDetail'))

// 팬아트 section
const FanartMain = lazy(() => import('../pages/fanart/FanartMain'))
const FanartDetail = lazy(() => import('../pages/fanart/FanartDetail'))
const FanartWebtoon = lazy(() => import('../pages/fanart/FanartWebtoon'))
const FanartCreate = lazy(() => import('../pages/fanart/FanartCreate'))

// 검색 section
const SearchRoot = lazy(() => import('../pages/search/SearchRoot'))

// 유저 프로필 section
const UserProfile = lazy(() => import('../pages/user/UserProfile'))

// 정책 section
const TermsOfService = lazy(() => import('../pages/policy/TermsOfService'))
const PrivacyPolicy = lazy(() => import('../pages/policy/PrivacyPolicy'))

// 에러 section
const ErrorPage = lazy(() => import('../pages/error/ErrorPage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <Page404 />,
    children: [
      // SSO 콜백
      {
        path: '/sso/providers/:provider/callback',
        element: (
          <Suspense fallback={<Loader />}>
            <SsoCallback />
          </Suspense>
        ),
      },

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
        path: '/webtoon/:webtoonId',
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
      {
        path: '/webtoon/myfavorite',
        element: (
          <Suspense fallback={<Loader />}>
            <FavoriteWebtoon />
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
          { index: true, element: <Navigate to={'webtoon'} replace /> },
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
            path: 'webtoon/:webtoonId',
            element: (
              <Suspense fallback={<Loader />}>
                <MyWebtoonDetail />
              </Suspense>
            ),
          },
          {
            path: 'webtoon/:webtoonId/update',
            element: (
              <Suspense fallback={<Loader />}>
                <MyWebtoonUpdate />
              </Suspense>
            ),
          },
          {
            path: 'webtoon/:webtoonId/episode/create',
            element: (
              <Suspense fallback={<Loader />}>
                <MyWebtoonEpisodeCreate />
              </Suspense>
            ),
          },
          {
            path: 'webtoon/episode/:episodeId/update',
            element: (
              <Suspense fallback={<Loader />}>
                <MyWebtoonEpisodeUpdate />
              </Suspense>
            ),
          },
          {
            path: 'webtoon/:webtoonId/goods',
            element: (
              <Suspense fallback={<Loader />}>
                <MyWebtoonGoods />
              </Suspense>
            ),
          },
          {
            path: 'webtoon/:webtoonId/goods/create',
            element: (
              <Suspense fallback={<Loader />}>
                <MyWebtoonGoodsCreate />
              </Suspense>
            ),
          },
          {
            path: 'webtoon/goods/update/:goodsId',
            element: (
              <Suspense fallback={<Loader />}>
                <MyWebtoonGoodsUpdate />
              </Suspense>
            ),
          },
          {
            path: 'fanart',
            element: (
              <Suspense fallback={<Loader />}>
                <MyFanart />
              </Suspense>
            ),
          },
          {
            path: 'fanart/:fanartId/update',
            element: (
              <Suspense fallback={<Loader />}>
                <MyFanartUpdate />
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
      // 팬아트 section
      {
        path: '/fanart',
        element: (
          <Suspense fallback={<Loader />}>
            <FanartMain />
          </Suspense>
        ),
      },
      {
        path: '/fanart/:fanartId',
        element: (
          <Suspense fallback={<Loader />}>
            <FanartDetail />
          </Suspense>
        ),
      },
      {
        path: '/fanart/webtoon/:webtoonId/',
        element: (
          <Suspense fallback={<Loader />}>
            <FanartWebtoon />
          </Suspense>
        ),
      },
      {
        path: 'fanart/webtoon/:webtoonId/create',
        element: (
          <Suspense fallback={<Loader />}>
            <FanartCreate />
          </Suspense>
        ),
      },
      // 검색 section
      {
        path: 'search',
        element: (
          <Suspense fallback={<Loader />}>
            <SearchRoot />
          </Suspense>
        ),
      },
      // 유저 프로필 section
      {
        path: 'user/:userId',
        element: (
          <Suspense fallback={<Loader />}>
            <UserProfile />
          </Suspense>
        ),
      },
      // 정책 section
      {
        path: 'policy/terms',
        element: (
          <Suspense fallback={<Loader />}>
            <TermsOfService />
          </Suspense>
        ),
      },
      {
        path: 'policy/privacy',
        element: (
          <Suspense fallback={<Loader />}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: 'error',
    element: (
      <Suspense fallback={<Loader />}>
        <ErrorPage />
      </Suspense>
    ),
  },
])
export default router