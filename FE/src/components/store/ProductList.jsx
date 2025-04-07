// ProductList.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ProductList = ({ products }) => {
  const navigate = useNavigate();

  // 상품 클릭 시 로컬 스토리지에 웹툰 ID 저장하고 상세 페이지로 이동
  const handleProductClick = (product) => {
    // 웹툰 ID 저장 (상세 페이지에서 필요)
    if (product.webtoonId) {
      localStorage.setItem('currentWebtoonId', product.webtoonId);
    }
    
    // 상품 타입에 따른 경로 설정
    if (product.category === '웹툰') {
      // 웹툰 컬렉션 페이지로 이동
      navigate(`/store/collection/${product.id}`);
    } else {
      // 상품 상세 페이지로 이동
      navigate(`/store/product/${product.id}`);
    }
  };

  return (
    <div className='grid grid-cols-3 gap-6'>
      {products.map((product) => (
        <div 
          key={product.id}
          onClick={() => handleProductClick(product)}
          className='overflow-hidden rounded-lg border border-gray-800 hover:border-gray-600 cursor-pointer'
        >
          <div className='relative h-[280px] w-full overflow-hidden'>
            <img 
              src={product.image} 
              alt={product.title} 
              className='h-full w-full object-cover transition duration-300 hover:scale-105' 
            />
            {product.status === 'notsell' && (
              <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
                <span className='text-white font-medium px-3 py-1 bg-red-500 rounded'>판매 종료</span>
              </div>
            )}
          </div>
          
          <div className='p-4'>
            <h3 className='mb-2 text-lg font-medium truncate'>{product.title}</h3>
            <div className='mb-3 flex items-center justify-between'>
              <span className='text-gray-400'>{product.genre || '기타'}</span>
              {product.category !== '웹툰' && (
                <span className='font-bold'>{product.price?.toFixed(2) || 0} ETH</span>
              )}
            </div>
            
            <button 
              className='w-full rounded-md bg-blue-600 py-2 font-medium hover:bg-blue-500'
              disabled={product.status === 'notsell'}
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick(product);
              }}
            >
              {product.category === '웹툰' 
                ? '컬렉션 보기' 
                : product.status === 'notsell' 
                  ? '판매 종료' 
                  : '상세 보기'
              }
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductList