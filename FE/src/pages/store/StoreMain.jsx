// StoreMain.jsx
import React, { useState, useEffect } from 'react'
import StoreFilter from '../../components/store/StoreFilter'
import ProductList from '../../components/store/ProductList'
import Loader from '../../components/common/Loader'
import { dummyProducts } from './storeData'

const StoreMain = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [activeFilters, setActiveFilters] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('') // 기본값은 빈 문자열로 설정 (선택 없음)

  // 더미 데이터 불러오기
  useEffect(() => {
    // API 호출 지연 시뮬레이션
    setTimeout(() => {
      setProducts(dummyProducts)
      
      // 초기에는 모든 상품을 최신순으로 표시
      const sortedProducts = [...dummyProducts].sort((a, b) => b.id - a.id)
      setFilteredProducts(sortedProducts)
      
      // 초기 필터는 빈 상태로 설정
      setActiveFilters({})
      
      setIsLoading(false)
    }, 800)
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

  // 필터링 적용
  useEffect(() => {
    let filtered = products
    
    // 필터 적용
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
    
    // 기본 정렬은 최신순 (id 기준 내림차순)
    filtered.sort((a, b) => b.id - a.id)
    
    setFilteredProducts(filtered)
  }, [activeFilters, products])

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
      product.genre.toLowerCase().includes(term.toLowerCase())
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
  
  // 각 카테고리별 상품 개수
  const categoryProductCounts = {
    웹툰: products.filter(p => p.category === '웹툰').length,
    굿즈: products.filter(p => p.category === '굿즈').length,
    팬아트: products.filter(p => p.category === '팬아트').length
  };

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