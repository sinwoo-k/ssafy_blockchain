import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  return (
    <div className='mx-2 mb-5'>
      {/* 상품 이미지 */}
      <div className='relative mb-2 rounded-xl bg-gray-300'>
        <Link to={`/store/product/${product.id}`}>
          <img
            src={product.image}
            alt={`${product.title} 상품 이미지`}
            className='h-[200px] w-full rounded-xl object-cover'
          />
          {product.discount > 0 && (
            <div className='absolute right-2 bottom-2 rounded bg-red-500 px-2 py-1 text-xs text-white'>
              {product.discount}%
            </div>
          )}
        </Link>
      </div>
      {/* 상품 정보 */}
      <div className='px-1'>
        <h3 className='mb-1 text-sm text-gray-400'>{product.category}</h3>
        <h2 className='mb-1 truncate text-base font-medium'>{product.title}</h2>
        <div className='flex items-center justify-between'>
          {product.discount > 0 ? (
            <div className='flex items-center'>
              <span className='mr-2 text-lg font-bold'>
                {Math.floor(
                  product.price * (1 - product.discount / 100)
                ).toLocaleString()}원
              </span>
              <span className='text-sm text-gray-400 line-through'>
                {product.price.toLocaleString()}원
              </span>
            </div>
          ) : (
            <span className='text-lg font-bold'>
              {product.price.toLocaleString()}원
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard