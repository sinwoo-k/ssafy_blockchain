import React, { useState, useEffect } from 'react'
import StoreFilter from '../../components/store/StoreFilter'
import ProductList from '../../components/store/ProductList'
import Loader from '../../components/common/Loader'
import { getwebtoonAuctions, getGoodsAuctions, getFanartAuctions } from '../../api/storeApi'

const StoreMain = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [activeFilters, setActiveFilters] = useState({ category: ['웹툰'] })
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('웹툰')
  const [categoryProductCounts, setCategoryProductCounts] = useState({ 웹툰: 0, 굿즈: 0, 팬아트: 0 })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [orderBy, setOrderBy] = useState('latest')
  const [selectedGenres, setSelectedGenres] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  // useEffect(() => {
  //   if (activeFilters.genre && activeFilters.genre.length > 0) {
  //     setSelectedGenres(activeFilters.genre)
  //   } else {
  //     setSelectedGenres([])
  //   }
  // }, [activeFilters.genre])
  
  // ✅ 상품 불러오기 (selectedGenres 변경될 때 작동)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        let fetchedProducts = []
        let totalPageCount = 0
        let totalItemCount = 0
  
        const getGenreParams = () => {
          return activeFilters.genre?.length > 0 ? { genres: activeFilters.genre } : {}
        }
  
        if (activeCategory === '웹툰') {
          const params = {
            ...getGenreParams(),
            page,
            pageSize: pageSize
          };
          
          console.log('웹툰 API 요청 파라미터:', params);
          const webtoons = await getwebtoonAuctions(params);
          console.log('API 응답 데이터 타입:', typeof webtoons, Array.isArray(webtoons));
          console.log('API 응답 데이터:', webtoons);
          
          // 안전하게 데이터 변환
          if (Array.isArray(webtoons) && webtoons.length > 0) {
            const fetched = webtoons.map((w) => ({
              id: w.webtoonId,
              title: w.webtoonName || '제목 없음',
              image: w.garoThumbnail || 'https://via.placeholder.com/280x280?text=이미지+없음',
              category: '웹툰',
              genre: w.genre || '',
              status: (w.episodeCount && w.episodeCount > 0) ? 'sell' : 'notsell',
              rating: w.rating || 0,
              writer: w.writer || '',
              description: w.summary || '',
              webtoonId: w.webtoonId,
              episodeCount: w.episodeCount || 0,
              viewCount: w.viewCount || 0,
              lastUploadDate : w.lastUploadDate || 0
            }));
            
            console.log('변환된 데이터 길이:', fetched.length);
            console.log('변환된 데이터 샘플:', fetched[0]);
            
            fetchedProducts = fetched;
            totalPageCount = Math.ceil(webtoons.length / pageSize) || 1;
            totalItemCount = webtoons.length;
            
            setCategoryProductCounts((prev) => ({ ...prev, 웹툰: webtoons.length }));
          } else {
            console.warn('웹툰 데이터가 비어있거나 배열이 아닙니다:', webtoons);
            fetchedProducts = [];
            totalPageCount = 5;
            totalItemCount = 0;
          }


        } else if (activeCategory === '굿즈') {
          const genreParams = getGenreParams()
          const goodsResponse = await getGoodsAuctions(genreParams)
          const goodsProducts = (goodsResponse?.content || goodsResponse || []).map(auction => ({
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
          totalItemCount = goodsResponse?.totalElements || goodsProducts.length
          setCategoryProductCounts((prev) => ({ ...prev, 굿즈: totalItemCount }))


        } else if (activeCategory === '팬아트') {
          const genreParams = getGenreParams()
          const fanartResponse = await getFanartAuctions(genreParams)
          const fanartProducts = (fanartResponse?.content || fanartResponse || []).map(auction => ({
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
          totalItemCount = fanartResponse?.totalElements || fanartProducts.length
          setCategoryProductCounts((prev) => ({ ...prev, 팬아트: totalItemCount }))
        }
  
        setProducts(fetchedProducts)
        setFilteredProducts(fetchedProducts)
        setTotalPages(totalPageCount || 0)
        setTotalElements(totalItemCount)
      } catch (err) {
        console.error('스토어 상품 API 에러:', err)
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchProducts()
  }, [activeCategory, page, pageSize, orderBy, JSON.stringify(activeFilters.genre)])

  
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
      console.log('장르 필터 변경:', filterId); // 디버깅용
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
  
        // ✅ 바로 장르 반영
        const updatedGenres = newFilters.genre || [];
        console.log('업데이트된 장르 목록:', updatedGenres); // 디버깅용

      // 중요: setTimeout을 사용하여 상태 업데이트 타이밍 분리
      setTimeout(() => {
        setSelectedGenres(updatedGenres);
        console.log('selectedGenres 상태 업데이트됨'); // 디버깅용
      }, 0);
  
        return newFilters
      })
  
    } else {
      setActiveFilters(prev => {
        const newFilters = { ...prev }
  
        if (!newFilters[groupId]) {
          newFilters[groupId] = [filterId]
        } else if (newFilters[groupId].includes(filterId)) {
          newFilters[groupId] = newFilters[groupId].filter(id => id !== filterId)
          if (newFilters[groupId].length === 0) {
            if (groupId === 'category') {
              newFilters[groupId] = ['웹툰']
            } else {
              delete newFilters[groupId]
            }
          }
        } else {
          newFilters[groupId].push(filterId)
        }
  
        // ✅ 카테고리 반영
        if (groupId === 'category') {
          if (newFilters.category?.length === 1) {
            setActiveCategory(newFilters.category[0])
          } else if (!newFilters.category || newFilters.category.length === 0) {
            setActiveCategory('웹툰')
            newFilters.category = ['웹툰']
          }
        }
  
        return newFilters
      })
    }
  
    // ✅ 공통: 필터 변경 시 페이지 초기화
    setPage(1)
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

  // 페이지 변경 핸들러 추가
  const handlePageChange = (newPage) => {
    console.log(`페이지 변경 시도: ${page} -> ${newPage}`);
    if (newPage < 1 || newPage > totalPages) {
      console.warn(`유효하지 않은 페이지 번호: ${newPage}`);
      return;
    }
    setPage(newPage);
    console.log(`페이지 상태 업데이트: ${newPage}`);
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
                    <option value="lastUploadDate">최신순</option>
                    <option value="rating">평점순</option>
                    <option value="viewCount">조회수순</option>
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
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  {/* 페이지 번호 직접 선택 방식 */}
                  {[...Array(totalPages).keys()].map(i => (
                    <button
                      key={i + 1}
                      onClick={() => {
                        const newPage = i + 1;
                        console.log(`페이지 ${newPage}로 이동`);
                        setPage(newPage);
                      }}
                      className={`h-8 w-8 rounded-full ${
                        page === i + 1 ? 'bg-blue-500' : 'bg-gray-700'
                      } text-white flex items-center justify-center`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
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