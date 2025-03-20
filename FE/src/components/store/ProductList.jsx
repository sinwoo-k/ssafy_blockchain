import React from 'react'
import ProductCard from './ProductCard'

const ProductList = ({ products }) => {
  return (
    <div className='grid grid-cols-4 gap-x-4'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      
      {products.length === 0 && (
        <div className='col-span-4 mt-10 text-center text-gray-400'>
          <p className='text-lg'>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  )
}

export default ProductList