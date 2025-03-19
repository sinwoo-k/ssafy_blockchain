import React, { useState, useEffect } from 'react'
import StoreFilter from '../../components/store/StoreFilter'
import ProductList from '../../components/store/ProductList'
import Loader from '../../components/common/Loader'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const StoreMain = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [activeFilters, setActiveFilters] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [backgroundImg, setBackgroundImg] = useState('')

  // 캐러셀 설정
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    beforeChange: (current, next) => {
      if (featuredProducts[next]) {
        setBackgroundImg(featuredProducts[next].image);
      }
    },
  }

  // 더미 데이터 생성 (실제로는 API에서 가져올 것)
  useEffect(() => {
    const dummyCategories = [
        '액션',
        '로맨스',
        '판타지',
        '개그',
        '스릴러',
        '드라마',
        '일상',
        '무협/사극',
        '스포츠',
        '감성'
    ]
    
    const generateDummyProducts = () => {
      return Array.from({ length: 24 }, (_, i) => {
        const category = dummyCategories[Math.floor(Math.random() * dummyCategories.length)]
        const discount = Math.random() > 0.6 ? Math.floor(Math.random() * 50) + 10 : 0
        
        return {
          id: i + 1,
          title: `상품 ${i + 1} ${category} 아이템`,
          category: category,
          price: Math.floor(Math.random() * 50000) + 5000,
          discount: discount,
          image: `/api/placeholder/${Math.floor(Math.random() * 50) + 200}/${Math.floor(Math.random() * 50) + 200}`,
        }
      })
    }

    setTimeout(() => {
      const dummyProducts = generateDummyProducts()
      setProducts(dummyProducts)
      setFilteredProducts(dummyProducts)
      setCategories(dummyCategories)
      
      // 추천 상품은 할인이 있는 상품 중에서 선택
      const discountedProducts = dummyProducts.filter(p => p.discount > 0)
      setFeaturedProducts(discountedProducts.slice(0, 6))
      if (discountedProducts.length > 0) {
        setBackgroundImg(discountedProducts[0].image)
      }
      
      setIsLoading(false)
    }, 1000)
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
        
        if (groupId === 'category') {
          return filterIds.includes(product.category)
        }
        
        if (groupId === 'main') {
          if (filterIds.includes('sale') && product.discount > 0) return true
          if (filterIds.includes('all')) return true
          // 이벤트 및 기타 필터 로직 추가 가능
        }
        
        // 캐릭터 필터 로직 추가 가능
        
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
      product.category.toLowerCase().includes(term.toLowerCase())
    )
    
    setFilteredProducts(searchResult)
  }

  return (
    <div className='text-text/85 min-h-screen bg-black pt-[80px] pb-10'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* 추천 상품 섹션 */}
          <div className={`relative mb-10 flex w-full justify-center py-10`}>
            <div
              className='absolute inset-0 bg-cover bg-center'
              style={{
                backgroundImage: `url(${backgroundImg})`,
                filter: 'blur(35px) brightness(0.5)',
              }}
            ></div>
            <div className='relative w-[1160px]'>
              <h1 className='mt-8 mb-5 text-2xl'>🔥 인기 상품</h1>
              <div>
                <Slider {...sliderSettings}>
                  {featuredProducts.map((product) => (
                    <div key={`featured-${product.id}`} className='px-3'>
                      <div className='relative overflow-hidden rounded-xl'>
                        <img
                          src={product.image}
                          alt={product.title}
                          className='h-[220px] w-full object-cover'
                        />
                        <div className='absolute bottom-0 left-0 right-0 bg-black/70 p-3'>
                          <h3 className='mb-1 text-lg font-medium'>{product.title}</h3>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                              <span className='mr-2 text-xl font-bold text-white'>
                                {Math.floor(product.price * (1 - product.discount / 100)).toLocaleString()}원
                              </span>
                              <span className='text-sm text-gray-400 line-through'>
                                {product.price.toLocaleString()}원
                              </span>
                            </div>
                            <div className='rounded-md bg-red-500 px-2 py-1 text-sm'>
                              {product.discount}% 할인
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>

          {/* 메인 스토어 섹션 */}
          <div className='mx-auto flex w-[1200px]'>
            {/* 필터 사이드바 */}
            <StoreFilter 
              categories={categories} 
              onFilterChange={handleFilterChange}
            />
            
            {/* 상품 목록 */}
            <div className='flex-1'>
              <div className='mb-6 flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>전체 상품</h1>
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
                    <option>할인율순</option>
                  </select>
                </div>
              </div>
              
              <ProductList products={filteredProducts} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default StoreMain
