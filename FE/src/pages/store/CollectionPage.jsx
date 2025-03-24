// CollectionPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import CollectionDetailInfo from '../../components/store/CollectionDetailInfo'
import { dummyProducts } from './storeData'

// 더미 에피소드 데이터 생성 함수
const generateDummyEpisodes = (count, webtoonId, startId = 0) => {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    title: `${i + 1}화`,
    webtoonId: webtoonId,
    price: 0.05 + (Math.random() * 0.1).toFixed(2) * 1,
    uploadDate: `2025-0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 28) + 1}`,
    image: `/api/placeholder/300/${320 + i}`,
    status: Math.random() > 0.2 ? 'sell' : 'notsell',
    category: '웹툰회차' // 웹툰 카테고리로 설정하여 구매 페이지에서 구분
  }))
}

// 더미 태그 생성 함수
const generateDummyTags = (genre) => {
  const tagsByGenre = {
    '판타지': ['판타지', '마법사', '먼치킨', '모험', '이세계', '용사'],
    '액션': ['액션', '격투', '무협', '히어로', '배틀', '격돌'],
    '로맨스': ['로맨스', '연애', '멜로', '학교', '직장', '삼각관계'],
    '드라마': ['드라마', '일상', '성장', '가족', '감동', '우정'],
    '무협/사극': ['무협', '사극', '고전', '무당', '전통', '동방'],
    '코미디': ['코미디', '개그', '일상', '유머', '직장', '학교'],
    '스릴러': ['스릴러', '공포', '미스터리', '서스펜스', '심리', '추리'],
    'SF': ['SF', '미래', '우주', '로봇', '외계인', '기술'],
    '스포츠': ['스포츠', '야구', '축구', '격투기', '농구', '승부'],
    '일상': ['일상', '학교', '직장', '성장', '청춘', '힐링']
  };

  // 기본 태그 설정
  let tags = tagsByGenre[genre] || ['웹툰', '만화', '체인툰', '아트'];
  
  // 태그 객체로 변환
  return tags.map((tag, index) => ({
    id: index,
    tagName: tag
  }));
};

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
    console.log("CollectionPage mounted with ID:", collectionId);
    
    // API 호출 지연 시뮬레이션
    setTimeout(() => {
      // 컬렉션 정보 가져오기 (실제로는 API 호출)
      const foundCollection = dummyProducts.find(p => p.id === parseInt(collectionId));
      
      if (foundCollection) {
        // 작가 정보 추가 (웹툰인 경우)
        if (foundCollection.category === '웹툰' && !foundCollection.author) {
          foundCollection.author = '작가' + Math.floor(Math.random() * 10 + 1);
        }
        
        setCollection(foundCollection);
        
        // 태그 생성
        const dummyTags = generateDummyTags(foundCollection.genre)
        setTags(dummyTags)
        
        // 관련 웹툰 회차 생성 (더미 데이터)
        const dummyEpisodes = generateDummyEpisodes(15, parseInt(collectionId), 100)
        setEpisodes(dummyEpisodes)
        
        // 관련 상품들 (동일한 장르를 가진 다른 상품들)
        const relatedProducts = dummyProducts.filter(p => 
          p.id !== parseInt(collectionId) && p.genre === foundCollection.genre
        )
        setRelatedItems(relatedProducts)
      } else {
        console.error("Collection not found with ID:", collectionId);
      }
      
      setIsLoading(false)
    }, 800)
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