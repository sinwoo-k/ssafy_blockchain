// StoreMain.jsx
import React, { useState, useEffect } from 'react'
import StoreFilter from '../../components/store/StoreFilter'
import ProductList from '../../components/store/ProductList'
import Loader from '../../components/common/Loader'
import { getWebtoonList } from '../../api/webtoonAPI'
import { getEpisodeAuctions, getGoodsAuctions, getFanartAuctions } from '../../api/storeApi'

const StoreMain = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [activeFilters, setActiveFilters] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('')
  const [categoryProductCounts, setCategoryProductCounts] = useState({
    웹툰: 0,
    굿즈: 0,
    팬아트: 0
  })

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setIsLoading(true)

        // 웹툰 목록 불러오기
        const webtoons = await getWebtoonList()

        // 웹툰 상품 데이터 구성
        const webtoonProducts = webtoons.map(w => ({
          id: w.webtoonId,
          title: w.webtoonName,
          image: w.garoThumbnail,
          price: 0, // 웹툰 자체는 가격이 없으므로 0으로 설정
          category: '웹툰',
          genre: w.genre || '',
          status: w.episodeCount > 0 ? 'sell' : 'notsell',
          rating: w.rating,
          writer: w.writer,
          description: w.summary,
          webtoonId: w.webtoonId,
          episodeCount: w.episodeCount,
          viewCount: w.viewCount
        }))

        // 인기 웹툰 10개에 대해 경매 데이터 로드 (모든 웹툰의 데이터를 로드하면 API 요청이 너무 많아질 수 있음)
        const popularWebtoons = webtoons.slice(0, 10)
        
        let allEpisodeAuctions = []
        let allGoodsAuctions = []
        let allFanartAuctions = []
        
        // 각 웹툰별로 경매 데이터 로드
        for (const webtoon of popularWebtoons) {
          try {
            const webtoonId = webtoon.webtoonId
            
            // 병렬로 API 요청 실행
            const [episodeAuctions, goodsAuctions, fanartAuctions] = await Promise.all([
              getEpisodeAuctions(webtoonId),
              getGoodsAuctions(webtoonId),
              getFanartAuctions(webtoonId)
            ])
            
            // 가져온 데이터 합치기
            allEpisodeAuctions = [...allEpisodeAuctions, ...(episodeAuctions || [])]
            allGoodsAuctions = [...allGoodsAuctions, ...(goodsAuctions || [])]
            allFanartAuctions = [...allFanartAuctions, ...(fanartAuctions || [])]
          } catch (err) {
            console.warn(`웹툰 ID ${webtoon.webtoonId}의 경매 데이터 로드 실패:`, err)
          }
        }

        // 에피소드 경매 데이터 구성
        const episodeProducts = allEpisodeAuctions.map(auction => ({
          id: auction.auctionId,
          title: auction.title || `${auction.webtoonTitle || ''} ${auction.episodeNumber || ''}화`,
          image: auction.thumbnailUrl,
          price: auction.currentPrice || auction.startingPrice || 0,
          immediatePrice: auction.immediatePrice,
          category: '웹툰회차',
          genre: auction.genre || '',
          status: auction.ended === 'Y' ? 'notsell' : 'sell',
          webtoonId: auction.webtoonId,
          episodeId: auction.episodeId,
          auctionId: auction.auctionId,
          endTime: auction.endTime
        }))

        // 굿즈 경매 데이터 구성
        const goodsProducts = allGoodsAuctions.map(auction => ({
          id: auction.auctionId,
          title: auction.title || auction.goodsName || '굿즈',
          image: auction.thumbnailUrl,
          price: auction.currentPrice || auction.startingPrice || 0,
          immediatePrice: auction.immediatePrice,
          category: '굿즈',
          genre: auction.genre || '',
          status: auction.ended === 'Y' ? 'notsell' : 'sell',
          webtoonId: auction.webtoonId,
          goodsId: auction.goodsId,
          auctionId: auction.auctionId,
          endTime: auction.endTime,
          collectionId: auction.webtoonId
        }))

        // 팬아트 경매 데이터 구성
        const fanartProducts = allFanartAuctions.map(auction => ({
          id: auction.auctionId,
          title: auction.title || auction.fanartTitle || '팬아트',
          image: auction.thumbnailUrl,
          price: auction.currentPrice || auction.startingPrice || 0,
          immediatePrice: auction.immediatePrice,
          category: '팬아트',
          genre: auction.genre || '',
          status: auction.ended === 'Y' ? 'notsell' : 'sell',
          webtoonId: auction.webtoonId,
          fanartId: auction.fanartId,
          auctionId: auction.auctionId,
          endTime: auction.endTime,
          collectionId: auction.webtoonId
        }))

        // 모든 상품 데이터 합치기
        const merged = [...webtoonProducts, ...episodeProducts, ...goodsProducts, ...fanartProducts]
        setProducts(merged)
        
        // 카테고리별 상품 개수 업데이트
        setCategoryProductCounts({
          웹툰: webtoonProducts.length,
          굿즈: goodsProducts.length,
          팬아트: fanartProducts.length
        })
        
        // 기본 정렬은 최신순 (id 기준 내림차순)
        const sorted = [...merged].sort((a, b) => b.id - a.id)
        setFilteredProducts(sorted)
        
      } catch (err) {
        console.error('스토어 상품 API 에러:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllProducts()
  }, [])
  // 카테고리 선택 핸들러
const handleCategoryChange = (category) => {
  // 이미 선택된 카테고리를 다시 클릭하면 선택 해제
  if (activeCategory === category) {
    setActiveCategory('')
    setActiveFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters.category
      return newFilters
    })
  } else {
    setActiveCategory(category)
    
    // 카테고리 변경 시 필터 업데이트
    setActiveFilters(prevFilters => {
      const newFilters = { ...prevFilters }
      newFilters.category = [category]
      return newFilters
    })
  }
}

// 필터 변경 핸들러
const handleFilterChange = (groupId, filterId) => {
  setActiveFilters(prev => {
    const newFilters = { ...prev }
    
    if (!newFilters[groupId]) {
      newFilters[groupId] = [filterId]
    } else if (newFilters[groupId].includes(filterId)) {
      newFilters[groupId] = newFilters[groupId].filter(id => id !== filterId)
      if (newFilters[groupId].length === 0) {
        delete newFilters[groupId]
      }
    } else {
      newFilters[groupId].push(filterId)
    }
    
    // 카테고리 그룹에서 변경이 있으면 activeCategory도 업데이트
    if (groupId === 'category') {
      // 하나만 선택되었을 때 activeCategory 업데이트
      if (newFilters.category && newFilters.category.length === 1) {
        setActiveCategory(newFilters.category[0])
      } 
      // 카테고리가 하나도 선택되지 않으면 activeCategory도 초기화
      else if (!newFilters.category || newFilters.category.length === 0) {
        setActiveCategory('')
      }
    }
    
    return newFilters
  })
}

// 검색 핸들러
const handleSearch = (term) => {
  if (!term.trim()) {
    // 검색어가 없으면 필터만 적용한 상태로 돌아감
    let filtered = products
    
    if (Object.keys(activeFilters).length > 0) {
      filtered = products.filter(product => {
        return Object.entries(activeFilters).every(([groupId, filterIds]) => {
          if (filterIds.length === 0) return true
          
          if (groupId === 'category') {
            return filterIds.includes(product.category)
          }
          
          if (groupId === 'status') {
            return filterIds.includes(product.status)
          }
          
          if (groupId === 'genre') {
            return filterIds.includes(product.genre)
          }
          
          return false
        })
      })
    }
    
    // 기본 정렬은 최신순
    filtered.sort((a, b) => b.id - a.id)
    
    setFilteredProducts(filtered)
    return
  }
  
  // 현재 필터링된 상품 내에서 검색
  const searchResult = filteredProducts.filter(product => 
    product.title.toLowerCase().includes(term.toLowerCase()) ||
    (product.genre && product.genre.toLowerCase().includes(term.toLowerCase()))
  )
  
  setFilteredProducts(searchResult)
}


  const handleSort = (e) => {
    const sortOption = e.target.value
    const sortedProducts = [...filteredProducts]
    
    switch (sortOption) {
      case 'latest':
        // 최신순 (ID가 높은 것이 최신이라고 가정)
        sortedProducts.sort((a, b) => b.id - a.id)
        break
      case 'priceLow':
        // 가격 낮은순
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case 'priceHigh':
        // 가격 높은순
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }
    
    setFilteredProducts(sortedProducts)
  }

  // 전체 상품 개수
  const totalProductCount = filteredProducts.length;

  return (
    <div className='text-text/85 min-h-screen bg-black pt-[80px] pb-10'>
      {isLoading ? (
        <Loader />
      ) : (
        <div className='mx-auto w-[1200px] pt-8'>
          {/* 카테고리 탭 */}
          <div className='mb-8 border-b border-gray-700'>
            <div className='flex space-x-6'>
              <button
                className={`pb-4 text-lg font-medium ${
                  activeCategory === '웹툰' 
                    ? 'border-b-2 border-blue-500 text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => handleCategoryChange('웹툰')}
              >
                웹툰 ({categoryProductCounts.웹툰})
              </button>
              <button
                className={`pb-4 text-lg font-medium ${
                  activeCategory === '굿즈' 
                    ? 'border-b-2 border-blue-500 text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => handleCategoryChange('굿즈')}
              >
                굿즈 ({categoryProductCounts.굿즈})
              </button>
              <button
                className={`pb-4 text-lg font-medium ${
                  activeCategory === '팬아트' 
                    ? 'border-b-2 border-blue-500 text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => handleCategoryChange('팬아트')}
              >
                팬아트 ({categoryProductCounts.팬아트})
              </button>
            </div>
          </div>
          
          <div className='flex'>
            {/* 필터 사이드바 */}
            <StoreFilter 
              onFilterChange={handleFilterChange} 
              activeFilters={activeFilters} 
              activeCategory={activeCategory}
            />
            
            {/* 상품 목록 */}
            <div className='flex-1'>
              <div className='mb-6 flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>
                  {activeCategory || '전체 상품'} ({totalProductCount})
                </h1>
                <div className='flex items-center'>
                  <input
                    type='text'
                    placeholder='검색'
                    className='mr-2 rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm'
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <select 
                    className='rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm'
                    onChange={handleSort}
                    defaultValue="latest"
                  >
                    <option value="latest">최신순</option>
                    <option value="priceLow">가격 낮은순</option>
                    <option value="priceHigh">가격 높은순</option>
                  </select>
                </div>
              </div>
              
              <ProductList products={filteredProducts} />
              
              {filteredProducts.length === 0 && (
                <div className='mt-10 text-center text-gray-400'>
                  <p className='text-lg'>해당 조건의 상품이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreMain