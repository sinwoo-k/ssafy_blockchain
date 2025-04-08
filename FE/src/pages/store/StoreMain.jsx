// StoreMain.jsx 수정
import React, { useState, useEffect } from 'react'
import StoreFilter from '../../components/store/StoreFilter'
import ProductList from '../../components/store/ProductList'
import Loader from '../../components/common/Loader'
import { getwebtoonAuctions,getGoodsAuctions, getFanartAuctions } from '../../api/storeApi'

const StoreMain = () => {
  // 기본값으로 웹툰 카테고리 선택
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [activeFilters, setActiveFilters] = useState({
    category: ['웹툰'] // 기본값으로 웹툰 카테고리 필터 설정
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('웹툰') // 기본값으로 웹툰 선택
  const [categoryProductCounts, setCategoryProductCounts] = useState({
    웹툰: 0,
    굿즈: 0,
    팬아트: 0
  })
  
  // 페이징 및 정렬 상태 추가
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [orderBy, setOrderBy] = useState('latest')
  const [selectedGenres, setSelectedGenres] = useState([]) // 여러 장르 선택을 위해 배열로 변경
  
  // 페이지 정보
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        
        // 정렬 파라미터 설정
        let orderByParam = 'latest'
        if (orderBy === 'priceLow') {
          orderByParam = 'price,asc'
        } else if (orderBy === 'priceHigh') {
          orderByParam = 'price,desc'
        } else if (orderBy === 'rating') {
          orderByParam = 'rating,desc'
        } else if (orderBy === 'view') {
          orderByParam = 'viewCount,desc'
        }
        
        let fetchedProducts = []
        let totalPageCount = 0
        let totalItemCount = 0
        
        // 카테고리에 따라 다른 API 호출
        if (activeCategory === '웹툰') {
          // 웹툰 목록 불러오기
          let webtoons = []
          
          // 선택된 장르가 있는 경우, 각 장르별로 API 호출
          if (selectedGenres.length > 0) {
            for (const genre of selectedGenres) {
              const response = await getwebtoonAuctions(page, pageSize, orderBy, genre)
              webtoons = [...webtoons, ...response]
            }
          } else {
            webtoons = await getwebtoonAuctions(page, pageSize, orderBy)
          }
          
          // 중복 제거 (장르별로 불러올 때 중복될 수 있음)
          webtoons = webtoons.filter((webtoon, index, self) => 
            index === self.findIndex((w) => w.webtoonId === webtoon.webtoonId)
          )
          
          // 웹툰 데이터 구성
          fetchedProducts = webtoons.map(w => ({
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
          
          // 웹툰 카테고리 수 업데이트
          setCategoryProductCounts(prev => ({
            ...prev,
            웹툰: fetchedProducts.length
          }))
          
          totalPageCount = Math.ceil(fetchedProducts.length / pageSize)
          totalItemCount = fetchedProducts.length
        } 
        else if (activeCategory === '굿즈') {
          // 굿즈 경매 목록 불러오기
          const params = {
            page: page - 1,
            size: pageSize,
            sort: orderByParam
          }
          
          let goodsResponse
          
          // 선택된 장르가 있으면 추가
          if (selectedGenres.length > 0) {
            // 여러 장르 선택 시 쿼리 파라미터 구성
            params.genres = selectedGenres
            goodsResponse = await getGoodsAuctions('', '', params)
          } else {
            goodsResponse = await getGoodsAuctions('', '', params)
          }
          
          // 굿즈 데이터 구성
          const goodsProducts = (goodsResponse?.content || []).map(auction => ({
            id: auction.auctionItemId,
            auctionItemId: auction.auctionItemId,
            title: auction.itemName || '굿즈',
            image: auction.imageUrl,
            price: auction.biddingPrice || 0,
            buyNowPrice: auction.buyNowPrice,
            category: '굿즈',
            genre: auction.type || '',
            status: auction.ended === 'Y' ? 'notsell' : 'sell',
            type: auction.type,
            webtoonId: auction.webtoonId,
            nftId: auction.nftId,
            endTime: auction.endTime,
            startTime: auction.startTime,
            ended: auction.ended
          }))
          
          fetchedProducts = goodsProducts
          totalPageCount = goodsResponse?.totalPages || 1
          totalItemCount = goodsResponse?.totalElements || 0
          
          // 굿즈 카테고리 수 업데이트
          setCategoryProductCounts(prev => ({
            ...prev,
            굿즈: goodsResponse?.totalElements || 0
          }))
        } 
        else if (activeCategory === '팬아트') {
          // 팬아트 경매 목록 불러오기
          const params = {
            page: page - 1,
            size: pageSize,
            sort: orderByParam
          }
          
          let fanartResponse
          
          // 선택된 장르가 있으면 추가
          if (selectedGenres.length > 0) {
            // 여러 장르 선택 시 쿼리 파라미터 구성
            params.genres = selectedGenres
            fanartResponse = await getFanartAuctions(params)
          } else {
            fanartResponse = await getFanartAuctions('', '', params)
          }
          
          // 팬아트 데이터 구성
          const fanartProducts = (fanartResponse?.content || []).map(auction => ({
            id: auction.auctionItemId,
            auctionItemId: auction.auctionItemId,
            title: auction.itemName || '팬아트',
            image: auction.imageUrl,
            price: auction.biddingPrice || 0,
            buyNowPrice: auction.buyNowPrice,
            category: '팬아트',
            genre: auction.type || '',
            status: auction.ended === 'Y' ? 'notsell' : 'sell',
            type: auction.type,
            webtoonId: auction.webtoonId,
            nftId: auction.nftId,
            endTime: auction.endTime,
            startTime: auction.startTime,
            ended: auction.ended
          }))
          
          fetchedProducts = fanartProducts
          totalPageCount = fanartResponse?.totalPages || 1
          totalItemCount = fanartResponse?.totalElements || 0
          
          // 팬아트 카테고리 수 업데이트
          setCategoryProductCounts(prev => ({
            ...prev,
            팬아트: fanartResponse?.totalElements || 0
          }))
        }
        
        // 전체 데이터 상태 업데이트
        setProducts(fetchedProducts)
        setFilteredProducts(fetchedProducts)
        
        // 페이지 정보 업데이트
        setTotalPages(totalPageCount || 1)
        setTotalElements(totalItemCount)
        
      } catch (err) {
        console.error('스토어 상품 API 에러:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [activeCategory, page, pageSize, orderBy, selectedGenres]) // selectedGenres 의존성 추가

  // 가격 형식 포맷팅 함수 (불필요한 0 제거)
  const formatPrice = (price) => {
    if (!price) return '0'
    
    // 문자열로 변환 후 소수점 이하 불필요한 0 제거
    const parsedPrice = parseFloat(price)
    
    // 정수인 경우
    if (parsedPrice % 1 === 0) {
      return parsedPrice.toString()
    }
    
    // 소수인 경우, 불필요한 0 제거
    return parsedPrice.toString().replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
  }
  
  // 카테고리 선택 핸들러
  const handleCategoryChange = (category) => {
    // 이미 선택된 카테고리를 다시 클릭하면 웹툰으로 변경 (기본값)
    if (activeCategory === category) {
      setActiveCategory('웹툰')
      setActiveFilters(prev => ({
        ...prev,
        category: ['웹툰']
      }))
    } else {
      setActiveCategory(category)
      
      // 카테고리 변경 시 필터 업데이트
      setActiveFilters(prevFilters => {
        const newFilters = { ...prevFilters }
        newFilters.category = [category]
        return newFilters
      })
    }
    
    // 카테고리 변경 시 데이터 새로 불러오기
    setPage(1) // 페이지 초기화
  }

  // 필터 변경 핸들러
  const handleFilterChange = (groupId, filterId) => {
    if (groupId === 'genre') {
      // 장르 필터 처리
      setActiveFilters(prev => {
        const newFilters = { ...prev }
        
        if (!newFilters[groupId]) {
          newFilters[groupId] = [filterId]
        } else if (newFilters[groupId].includes(filterId)) {
          // 체크 해제 - 배열에서 제거
          newFilters[groupId] = newFilters[groupId].filter(id => id !== filterId)
          if (newFilters[groupId].length === 0) {
            delete newFilters[groupId]
          }
        } else {
          // 체크 - 배열에 추가
          newFilters[groupId].push(filterId)
        }
        
        // selectedGenres 업데이트
        if (newFilters.genre && newFilters.genre.length > 0) {
          setSelectedGenres(newFilters.genre)
        } else {
          setSelectedGenres([])
        }
        
        return newFilters
      })
    } else {
      // 카테고리 필터 처리
      setActiveFilters(prev => {
        const newFilters = { ...prev }
        
        if (!newFilters[groupId]) {
          newFilters[groupId] = [filterId]
        } else if (newFilters[groupId].includes(filterId)) {
          newFilters[groupId] = newFilters[groupId].filter(id => id !== filterId)
          if (newFilters[groupId].length === 0) {
            // 카테고리 필터가 비어있으면 기본값으로 웹툰 설정
            if (groupId === 'category') {
              newFilters[groupId] = ['웹툰']
            } else {
              delete newFilters[groupId]
            }
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
          // 카테고리가 하나도 선택되지 않으면 웹툰으로 설정
          else if (!newFilters.category || newFilters.category.length === 0) {
            setActiveCategory('웹툰')
            newFilters.category = ['웹툰']
          }
        }
        
        return newFilters
      })
    }
    
    // 필터 변경 시 데이터 새로 불러오기
    setPage(1) // 페이지 초기화
  }

  // 검색 핸들러
  const handleSearch = (term) => {
    if (!term.trim()) {
      // 검색어가 없으면 전체 상품 목록으로 돌아감
      setFilteredProducts(products)
      return
    }
    
    // 현재 상품 내에서 검색
    const searchResult = products.filter(product => 
      (product.title || '').toLowerCase().includes(term.toLowerCase()) ||
      ((product.genre || '').toLowerCase().includes(term.toLowerCase()))
    )
    
    setFilteredProducts(searchResult)
  }

  // 정렬 변경 핸들러
  const handleSort = (e) => {
    const newOrderBy = e.target.value
    setOrderBy(newOrderBy)
    
    // 현재 페이지 초기화
    setPage(1)
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
                  {activeCategory || '웹툰'} ({totalProductCount})
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
                    value={orderBy}
                  >
                    <option value="latest">최신순</option>
                    <option value="priceLow">가격 낮은순</option>
                    <option value="priceHigh">가격 높은순</option>
                    <option value="rating">평점순</option>
                    <option value="view">조회수순</option>
                  </select>
                </div>
              </div>
              
              <ProductList 
                products={filteredProducts}
                formatPrice={formatPrice}
              />
              
              {filteredProducts.length === 0 && (
                <div className='mt-10 text-center text-gray-400'>
                  <p className='text-lg'>해당 조건의 상품이 없습니다.</p>
                </div>
              )}
              
              {/* 페이지 네비게이션 - 페이지 정보 추가 */}
              <div className='mt-8 flex justify-center'>
                <div className='flex items-center'>
                  <button 
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className={`mx-1 rounded px-3 py-1 ${page === 1 ? 'bg-gray-700 text-gray-400' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                  >
                    이전
                  </button>
                  <span className='mx-2 text-gray-300'>페이지 {page} / {totalPages}</span>
                  <button 
                    onClick={() => setPage(prev => prev < totalPages ? prev + 1 : prev)}
                    disabled={page >= totalPages}
                    className={`mx-1 rounded px-3 py-1 text-white hover:bg-gray-600 ${page >= totalPages ? 'bg-gray-700 text-gray-400' : 'bg-gray-700'}`}
                  >
                    다음
                  </button>
                  
                  <select 
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className='ml-4 rounded bg-gray-700 px-2 py-1 text-white'
                  >
                    <option value={10}>10개</option>
                    <option value={20}>20개</option>
                    <option value={50}>50개</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreMain