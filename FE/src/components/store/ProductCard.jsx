// ProductCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  // 링크 URL 결정 로직
  const getLinkUrl = () => {
    // 웹툰인 경우 직접 컬렉션 페이지로
    if (product.category === '웹툰') {
      return `/store/collection/${product.id}`;
    }
    
    // 굿즈나 팬아트인 경우 관련 웹툰의 컬렉션 페이지로
    if (product.collectionId) {
      return `/store/collection/${product.collectionId}`;
    }
    
    // collectionId가 없는 경우 기본적으로 상품 상세 페이지로
    return `/store/product/${product.id}`;
  };

  return (
    <div className='mx-2 mb-5'>
      {/* 상품 이미지 */}
      <div className='relative mb-2 rounded-xl bg-gray-300'>
        <Link to={getLinkUrl()}>
          <img
            src={product.image}
            alt={`${product.title} 상품 이미지`}
            className='h-[200px] w-full rounded-xl object-cover'
          />
          {product.status === 'notsell' && (
            <div className='absolute inset-0 flex items-center justify-center rounded-xl bg-black/70'>
              <span className='text-lg font-medium text-white'>미판매</span>
            </div>
          )}
        </Link>
      </div>
      {/* 상품 정보 */}
      <div className='px-1'>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-gray-400'>{product.category}</span>
          <span className='text-sm text-gray-400'>{product.genre}</span>
        </div>
        <h2 className='mb-1 truncate text-base font-medium'>{product.title}</h2>
        <div className='flex items-center justify-between'>
          <span className='text-lg font-bold'>
            {product.price.toLocaleString()} ETH
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard