// CollectionPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import CollectionDetailInfo from '../../components/store/CollectionDetailInfo'
import { getWebtoon } from '../../api/webtoonAPI'
import { getEpisodeAuctions, getGoodsAuctions, getFanartAuctions } from '../../api/storeApi'

const CollectionPage = () => {
  const { collectionId } = useParams()
  const navigate = useNavigate()
  const [collection, setCollection] = useState(null)
  const [relatedItems, setRelatedItems] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [activeTab, setActiveTab] = useState('회차')
  const [isLoading, setIsLoading] = useState(true)
  const [tags, setTags] = useState([])

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        setIsLoading(true)
        
        // 웹툰 정보 가져오기
        const webtoonData = await getWebtoon(collectionId)
        
        if (webtoonData) {
          // 웹툰 정보 설정
          const collectionData = {
            id: webtoonData.webtoonId,
            title: webtoonData.webtoonName,
            category: '웹툰',
            genre: webtoonData.genre || '',
            price: 0,
            status: 'sell',
            image: webtoonData.garoThumbnail,
            author: webtoonData.writer,
            description: webtoonData.summary,
            rating: webtoonData.rating,
            views: webtoonData.viewCount,
            likes: webtoonData.favoriteCount
          }
          
          setCollection(collectionData)
          
          // 태그 생성 - API 응답에 태그 정보가 있으면 사용
          if (webtoonData.tags && webtoonData.tags.length > 0) {
            const tagsList = webtoonData.tags.map((tag, index) => ({
              id: index,
              tagName: tag
            }))
            setTags(tagsList)
          } else {
            // 기본 태그 설정
            const tagsList = []
            if (webtoonData.genre) {
              tagsList.push({ id: 1, tagName: webtoonData.genre })
            }
            tagsList.push({ id: 2, tagName: '웹툰' })
            tagsList.push({ id: 3, tagName: '체인툰' })
            setTags(tagsList)
          }
          
          // 관련 에피소드, 굿즈, 팬아트 불러오기
          const [episodeAuctions, goodsAuctions, fanartAuctions] = await Promise.all([
            getEpisodeAuctions(collectionId),
            getGoodsAuctions(collectionId),
            getFanartAuctions(collectionId)
          ])
          
          // 에피소드 데이터 구성
          const episodeItems = (episodeAuctions || []).map(auction => ({
            id: auction.auctionId,
            title: `${auction.episodeNumber || ''}화`,
            webtoonId: auction.webtoonId,
            price: auction.currentPrice || auction.startingPrice || 0,
            uploadDate: auction.createdAt ? new Date(auction.createdAt).toISOString().split('T')[0] : '',
            image: auction.thumbnailUrl,
            status: auction.ended === 'Y' ? 'notsell' : 'sell',
            category: '웹툰회차',
            auctionId: auction.auctionId,
            endTime: auction.endTime
          }))
          
          setEpisodes(episodeItems)
          
          // 관련 상품 데이터 구성 (굿즈와 팬아트)
          const relatedItemsList = [
            ...(goodsAuctions || []).map(auction => ({
              id: auction.auctionId,
              title: auction.title || auction.goodsName || '굿즈',
              image: auction.thumbnailUrl,
              price: auction.currentPrice || auction.startingPrice || 0,
              category: '굿즈',
              genre: webtoonData.genre || '',
              status: auction.ended === 'Y' ? 'notsell' : 'sell',
              webtoonId: auction.webtoonId,
              auctionId: auction.auctionId,
              collectionId: auction.webtoonId
            })),
            ...(fanartAuctions || []).map(auction => ({
              id: auction.auctionId,
              title: auction.title || auction.fanartTitle || '팬아트',
              image: auction.thumbnailUrl,
              price: auction.currentPrice || auction.startingPrice || 0,
              category: '팬아트',
              genre: webtoonData.genre || '',
              status: auction.ended === 'Y' ? 'notsell' : 'sell',
              webtoonId: auction.webtoonId,
              auctionId: auction.auctionId,
              collectionId: auction.webtoonId
            }))
          ]
          
          setRelatedItems(relatedItemsList)
        } else {
          console.error("웹툰 정보를 찾을 수 없습니다:", collectionId)
        }
      } catch (err) {
        console.error("컬렉션 데이터 로드 오류:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCollectionData()
  }, [collectionId])

  // 상품 페이지 이동 함수
  const navigateToProduct = (productId) => {
    navigate(`/store/product/${productId}`);
  }

  if (isLoading) {
    return <Loader />
  }

  if (!collection) {
    return (
      <div className='min-h-screen bg-black pt-[100px] pb-10 text-text/85'>
        <div className='mx-auto w-[1160px] text-center'>
          <h1 className='text-2xl'>컬렉션을 찾을 수 없습니다. (ID: {collectionId})</h1>
          <div className='mt-4 text-gray-400'>
            <p>가능한 원인:</p>
            <ul className='mt-2 list-disc pl-8'>
              <li>잘못된 ID 접근</li>
              <li>storeData.js 파일의 경로 불일치</li>
              <li>데이터 불러오기 실패</li>
            </ul>
          </div>
          <Link to="/store" className='mt-4 inline-block rounded bg-blue-600 px-6 py-2'>
            스토어로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  // 현재 활성화된 탭에 따라 보여줄 아이템 필터링
  const getFilteredItems = () => {
    if (activeTab === '회차') {
      // 회차 리스트 반환
      return episodes
    } else if (activeTab === '굿즈') {
      // 현재 컬렉션과 관련된 굿즈만 필터링
      return relatedItems.filter(item => item.category === '굿즈')
    } else if (activeTab === '팬아트') {
      // 현재 컬렉션과 관련된 팬아트만 필터링
      return relatedItems.filter(item => item.category === '팬아트')
    }
    return []
  }

  return (
    <div className='min-h-screen bg-black pt-[80px] pb-10 text-text/85'>
      {/* 컬렉션 디테일 정보 컴포넌트 사용 */}
      <CollectionDetailInfo collection={collection} tags={tags} />
        
      {/* 탭 메뉴 */}
      <div className='mx-auto w-[1160px]'>
        <div className='mb-6 border-b border-gray-700'>
          <div className='flex space-x-6'>
            <button
              className={`pb-4 text-lg font-medium ${
                activeTab === '회차' 
                  ? 'border-b-2 border-blue-500 text-white' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('회차')}
            >
              회차
            </button>
            <button
              className={`pb-4 text-lg font-medium ${
                activeTab === '굿즈' 
                  ? 'border-b-2 border-blue-500 text-white' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('굿즈')}
            >
              굿즈
            </button>
            <button
              className={`pb-4 text-lg font-medium ${
                activeTab === '팬아트' 
                  ? 'border-b-2 border-blue-500 text-white' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('팬아트')}
            >
              팬아트
            </button>
          </div>
        </div>
        
        {/* 컨텐츠 영역 */}
        {activeTab === '회차' ? (
          // 회차 리스트 표시 - 피그마 디자인에 맞게 수정
          <div>
            <div className='mb-4 flex justify-between'>
              <span>총 {episodes.length}화</span>
              <div className='flex gap-4'>
                <button className='text-gray-400 hover:text-white'>최신화부터</button>
                <button className='text-gray-400 hover:text-white'>1화부터</button>
              </div>
            </div>
            
            {episodes.length > 0 ? (
              <div className='border-t border-gray-700'>
                {episodes.map((episode) => (
                  <div 
                    key={episode.id} 
                    className='border-b border-gray-700 hover:bg-gray-800'
                  >
                    <div className='flex h-[150px] items-center gap-8 px-4'>
                      <div className='h-[100px] w-[160px]'>
                        <img 
                          src={episode.image} 
                          alt={episode.title} 
                          className='h-full w-full rounded-lg object-cover' 
                        />
                      </div>
                      <div className='flex-1'>
                        <h3 className='mb-2 text-xl'>{episode.title}</h3>
                        <div className='flex gap-4 text-gray-400'>
                          <span>{episode.price.toFixed(2)} ETH</span>
                          <span>{episode.uploadDate}</span>
                          {episode.status === 'notsell' && (
                            <span className='text-red-400'>미판매</span>
                          )}
                        </div>
                      </div>
                      {/* 구매 버튼 - 상세 페이지로 이동하도록 수정 */}
                      <div>
                        <button 
                          onClick={() => navigateToProduct(episode.id)}
                          disabled={episode.status === 'notsell'}
                          className={`flex items-center rounded-md px-4 py-2 ${
                            episode.status === 'notsell'
                              ? 'cursor-not-allowed bg-gray-700 text-gray-400'
                              : 'bg-blue-600 hover:bg-blue-500'
                          }`}
                        >
                          {episode.status === 'notsell' ? '판매 종료' : '구매하기'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='py-10 text-center text-gray-400'>
                <p>등록된 회차가 없습니다.</p>
              </div>
            )}
          </div>
        ) : (
          // 굿즈 또는 팬아트 리스트 표시
          <div>
            <h2 className='mb-6 text-xl font-medium'>
              {collection.title} 관련 {activeTab}
            </h2>
            
            {getFilteredItems().length > 0 ? (
              <div className='grid grid-cols-4 gap-6'>
                {getFilteredItems().map(item => (
                  <div key={item.id} className='overflow-hidden rounded-lg border border-gray-800 hover:border-gray-600'>
                    <div className='relative h-[250px] w-full overflow-hidden'>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className='h-full w-full object-cover transition duration-300 hover:scale-105' 
                      />
                    </div>
                    <div className='p-4'>
                      <h3 className='mb-2 text-lg font-medium'>{item.title}</h3>
                      <div className='mb-3 flex items-center justify-between'>
                        <span className='text-gray-400'>{item.genre}</span>
                        <span className='font-bold'>{item.price.toFixed(2)} ETH</span>
                      </div>
                      <button 
                        onClick={() => navigateToProduct(item.id)} 
                        className='w-full rounded-md bg-blue-600 py-2 font-medium hover:bg-blue-500'
                      >
                        상세 보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='py-10 text-center text-gray-400'>
                <p>관련 {activeTab}가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionPage