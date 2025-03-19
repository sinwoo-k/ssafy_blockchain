// ProductDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import { useSelector } from 'react-redux'
import { dummyProducts } from '../store/storeData'

// 아이콘
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import StarIcon from '@mui/icons-material/Star'

const ProductDetail = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedOption, setSelectedOption] = useState('')
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  // 상품 정보 불러오기
  useEffect(() => {
    // API 호출 지연 시뮬레이션
    setTimeout(() => {
      const foundProduct = dummyProducts.find(p => p.id === parseInt(productId));
      
      if (foundProduct) {
        // 실제 API에서는 받아오지 않을 추가 정보
        const productDetails = {
          ...foundProduct,
          description: `이 상품은 ${foundProduct.genre} 웹툰 팬들을 위한 ${foundProduct.category} 아이템입니다. 고품질 소재를 사용하여 제작되었으며, 웹툰 캐릭터의 디테일을 정교하게 표현했습니다.`,
          details: [
            '크기: 20cm x 15cm',
            '소재: PVC',
            '제조사: 체인툰 스튜디오',
            '원산지: 대한민국',
            '제조일: 2025-01-15'
          ],
          options: ['기본 색상', '레드 에디션', '블루 에디션', '스페셜 에디션'],
          rating: 4.8,
          reviewCount: 126,
          relatedWebtoon: {
            id: 2,
            title: `${foundProduct.genre} 웹툰`,
            author: '작가 이름'
          }
        };
        
        setProduct(productDetails);
      }
      setIsLoading(false)
    }, 800)
  }, [productId])

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0 && value <= 10) {
      setQuantity(value)
    }
  }

  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (isLoading) {
    return <Loader />
  }
  
  if (!product) {
    return (
      <div className='min-h-screen bg-black pt-[100px] pb-10 text-text/85'>
        <div className='mx-auto w-[1160px] text-center'>
          <h1 className='text-2xl'>상품을 찾을 수 없습니다.</h1>
          <Link to="/store" className='mt-4 inline-block rounded bg-blue-600 px-6 py-2'>
            스토어로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-black pt-[100px] pb-10 text-text/85'>
      <div className='mx-auto w-[1160px]'>
        {/* 뒤로가기 버튼 */}
        <div className='mb-6'>
          <Link to='/store' className='flex items-center text-gray-400 hover:text-white'>
            <ArrowBackIcon />
            <span className='ml-1'>스토어로 돌아가기</span>
          </Link>
        </div>

        {/* 상품 정보 섹션 */}
        <div className='mb-10 flex gap-10'>
          {/* 상품 이미지 */}
          <div className='w-[500px]'>
            <img 
              src={product.image} 
              alt={product.title} 
              className='h-[500px] w-full rounded-lg object-cover' 
            />
            {product.status === 'notsell' && (
              <div className='mt-4 rounded bg-red-500 p-3 text-center text-white'>
                현재 판매가 종료된 상품입니다.
              </div>
            )}
          </div>

          {/* 상품 상세 정보 */}
          <div className='flex flex-1 flex-col'>
            <div className='mb-2 text-gray-400'>{product.category} | {product.genre}</div>
            <h1 className='mb-4 text-3xl font-bold'>{product.title}</h1>
            
            {/* 별점 */}
            <div className='mb-4 flex items-center'>
              <div className='flex items-center'>
                <StarIcon sx={{ color: '#ffff19' }} />
                <span className='ml-1'>{product.rating}</span>
              </div>
              <span className='mx-2 text-gray-400'>|</span>
              <span className='text-gray-400'>리뷰 {product.reviewCount}개</span>
            </div>
            
            {/* 가격 정보 */}
            <div className='mb-6'>
              <span className='text-3xl font-bold'>{product.price.toLocaleString()}원</span>
            </div>
            
            {/* 상품 설명 */}
            <p className='mb-6 text-gray-300'>{product.description}</p>
            
            {/* 옵션 선택 */}
            <div className='mb-4'>
              <label className='mb-2 block text-gray-300'>옵션 선택</label>
              <select 
                className='w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white'
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                disabled={product.status === 'notsell'}
              >
                <option value=''>옵션을 선택하세요</option>
                {product.options.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            {/* 수량 선택 */}
            <div className='mb-6'>
              <label className='mb-2 block text-gray-300'>수량</label>
              <div className='flex h-[50px] items-center'>
                <button 
                  onClick={decreaseQuantity}
                  className='flex h-full w-[50px] items-center justify-center rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-xl'
                  disabled={product.status === 'notsell'}
                >
                  -
                </button>
                <input
                  type='number'
                  min='1'
                  max='10'
                  value={quantity}
                  onChange={handleQuantityChange}
                  className='h-full w-[80px] border-y border-gray-700 bg-gray-800 text-center'
                  disabled={product.status === 'notsell'}
                />
                <button 
                  onClick={increaseQuantity}
                  className='flex h-full w-[50px] items-center justify-center rounded-r-md border border-l-0 border-gray-700 bg-gray-800 text-xl'
                  disabled={product.status === 'notsell'}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* 총 금액 */}
            <div className='mb-6 flex items-center justify-between border-y border-gray-700 py-4'>
              <span className='text-xl'>총 금액</span>
              <span className='text-2xl font-bold'>
                {(product.price * quantity).toLocaleString()}원
              </span>
            </div>
            
            {/* 구매 버튼 */}
            <div className='flex gap-3'>
              <button 
                className='flex-1 rounded-md bg-gray-700 py-3 px-6 text-lg font-medium hover:bg-gray-600'
                onClick={() => alert('위시리스트에 추가되었습니다.')}
                disabled={product.status === 'notsell'}
              >
                <FavoriteIcon className='mr-2' />
                찜하기
              </button>
              <button 
                className={`flex-1 rounded-md py-3 px-6 text-lg font-medium ${
                  product.status === 'notsell' 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
                onClick={() => {
                  if (!isAuthenticated) {
                    alert('로그인이 필요한 서비스입니다.')
                    return
                  }
                  if (!selectedOption) {
                    alert('옵션을 선택해주세요')
                    return
                  }
                  alert('장바구니에 추가되었습니다.')
                }}
                disabled={product.status === 'notsell'}
              >
                <ShoppingCartIcon className='mr-2' />
                장바구니 담기
              </button>
            </div>
          </div>
        </div>
        
        {/* 상품 상세 정보 탭 */}
        <div className='mb-10'>
          <div className='mb-4 border-b border-gray-700'>
            <button className='border-b-2 border-blue-500 py-3 px-6 text-lg font-medium'>
              상세정보
            </button>
            <button className='py-3 px-6 text-lg font-medium text-gray-400'>
              리뷰 ({product.reviewCount})
            </button>
            <button className='py-3 px-6 text-lg font-medium text-gray-400'>
              Q&A
            </button>
          </div>
          
          <div className='rounded-lg bg-gray-900 p-6'>
            <h2 className='mb-4 text-xl font-medium'>상품 정보</h2>
            <ul className='space-y-2'>
              {product.details.map((detail, index) => (
                <li key={index} className='flex border-b border-gray-800 pb-2'>
                  <span className='text-gray-400'>{detail}</span>
                </li>
              ))}
            </ul>
            
            {product.relatedWebtoon && (
              <div className='mt-6'>
                <h3 className='mb-2 text-lg font-medium'>관련 웹툰</h3>
                <Link 
                  to={`/webtoon/${product.relatedWebtoon.id}`}
                  className='flex items-center rounded-md bg-gray-800 p-3 hover:bg-gray-700'
                >
                  <div className='mr-4 h-16 w-16 rounded bg-gray-700'></div>
                  <div>
                    <div className='font-medium'>{product.relatedWebtoon.title}</div>
                    <div className='text-sm text-gray-400'>{product.relatedWebtoon.author}</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail