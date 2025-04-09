// ProductList.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ProductList = ({ products, formatPrice }) => {
  const navigate = useNavigate();

  // 가격 형식 포맷팅 함수 - formatPrice가 전달되지 않은 경우를 위한 내부 함수
  const formatPriceInternal = (price) => {
    if (formatPrice) return formatPrice(price);
    
    if (!price) return '0';
    
    // 문자열로 변환 후 소수점 이하 불필요한 0 제거
    const parsedPrice = parseFloat(price);
    
    // 정수인 경우
    if (parsedPrice % 1 === 0) {
      return parsedPrice.toString();
    }
    
    // 소수인 경우, 불필요한 0 제거
    return parsedPrice.toString().replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  };

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
      // 상품 상세 페이지로 이동 (auctionItemId가 있으면 그것을 사용)
      const itemId = product.auctionItemId || product.id;
      navigate(`/store/product/${itemId}`);
    }
  };

  return (
    <div className='grid grid-cols-3 gap-6'>
      {products.map((product) => (
        <div 
          key={product.id || product.auctionItemId}
          onClick={() => handleProductClick(product)}
          className='overflow-hidden rounded-lg border border-gray-800 hover:border-gray-600 cursor-pointer'
        >
          <div className='relative h-[280px] w-full overflow-hidden'>
            <img 
              src={product.image || product.imageUrl} 
              alt={product.title || product.itemName} 
              className='h-full w-full object-cover transition duration-300 hover:scale-105' 
            />
          </div>
          
          <div className='p-4'>
            <h3 className='mb-2 text-lg font-medium truncate'>{product.title || product.itemName}</h3>
            <div className='mb-3 flex items-center justify-between'>
              <span className='text-gray-400'>{product.genre || product.type || '기타'}</span>
              {product.category !== '웹툰' && (
                <span className='font-bold'>{formatPriceInternal(product.price || product.biddingPrice)} ETH</span>
              )}
            </div>
            
            <button 
              className='w-full rounded-md bg-blue-600 py-2 font-medium hover:bg-blue-500'
              disabled={product.status === 'notsell' || product.ended === 'Y'}
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick(product);
              }}
            >
              {product.category === '웹툰' 
                ? '컬렉션 보기' 
                : product.status === 'notsell' || product.ended === 'Y'
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