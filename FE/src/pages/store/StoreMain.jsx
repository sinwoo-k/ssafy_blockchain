// StoreMain.jsx
import React, { useState, useEffect } from 'react'
import StoreFilter from '../../components/store/StoreFilter'
import ProductList from '../../components/store/ProductList'
import Loader from '../../components/common/Loader'
import { dummyProducts } from '../store/storeData'

const StoreMain = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [activeFilters, setActiveFilters] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // 더미 데이터 불러오기
  useEffect(() => {
    // API 호출 지연 시뮬레이션
    setTimeout(() => {
      setProducts(dummyProducts)
      setFilteredProducts(dummyProducts)
      setIsLoading(false)
    }, 800)
  }, [])

  const handleFilterChange = (groupId, filterId) => {
    setActiveFilters((prev) => {
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
      
      return newFilters
    })
  }

  useEffect(() => {
    // 필터링 로직
    if (Object.keys(activeFilters).length === 0) {
      setFilteredProducts(products)
      return
    }
    
    const filtered = products.filter(product => {
      // 각 필터 그룹에 대해 검사
      return Object.entries(activeFilters).every(([groupId, filterIds]) => {
        if (filterIds.length === 0) return true
        
        if (groupId === 'status') {
          return filterIds.includes(product.status)
        }
        
        if (groupId === 'genre') {
          return filterIds.includes(product.genre)
        }
        
        if (groupId === 'category') {
          return filterIds.includes(product.category)
        }
        
        return false
      })
    })
    
    setFilteredProducts(filtered)
  }, [activeFilters, products])

  const handleSearch = (term) => {
    if (!term.trim()) {
      setFilteredProducts(products)
      return
    }
    
    const searchResult = products.filter(product => 
      product.title.toLowerCase().includes(term.toLowerCase()) ||
      product.category.toLowerCase().includes(term.toLowerCase()) ||
      product.genre.toLowerCase().includes(term.toLowerCase())
    )
    
    setFilteredProducts(searchResult)
  }

  return (
    <div className='text-text/85 min-h-screen bg-black pt-[80px] pb-10'>
      {isLoading ? (
        <Loader />
      ) : (
        <div className='mx-auto flex w-[1200px] pt-8'>
          {/* 필터 사이드바 */}
          <StoreFilter onFilterChange={handleFilterChange} />
          
          {/* 상품 목록 */}
          <div className='flex-1'>
            <div className='mb-6 flex items-center justify-between'>
              <h1 className='text-2xl font-bold'>스토어</h1>
              <div className='flex items-center'>
                <input
                  type='text'
                  placeholder='내 작품 검색'
                  className='mr-2 rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm'
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <select className='rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm'>
                  <option>최신 순으로</option>
                  <option>가격 낮은순</option>
                  <option>가격 높은순</option>
                </select>
              </div>
            </div>
            
            <ProductList products={filteredProducts} />
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreMain