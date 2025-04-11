// ProductList.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ProductList = ({ products, formatPrice }) => {
  const navigate = useNavigate();
    // 디버깅용 로그 추가
    console.log("ProductList 컴포넌트 렌더링 - 받은 상품 수:", products?.length);
    console.log("ProductList 상품 데이터:", products);

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
      {products && products.length > 0 ? (
        products.map((product, index) => {
          // 디버깅용 로그
          console.log(`상품 ${index}:`, product);
          
          return (
            <div 
              key={product.id || `product-${index}`}
              onClick={() => handleProductClick(product)}
              className='overflow-hidden rounded-lg border border-gray-800 hover:border-gray-600 cursor-pointer'
            >
              <div className='relative h-[280px] w-full overflow-hidden'>
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className='h-full w-full object-cover transition duration-300 hover:scale-105'
                  onError={(e) => {
                    console.log("이미지 로드 실패:", product.image);
                    e.target.src = 'https://via.placeholder.com/280x280?text=이미지+없음';
                  }}
                />
              </div>
              
              <div className='p-4'>
                <h3 className='mb-2 text-lg font-medium truncate'>{product.title || '제목 없음'}</h3>
                <div className='mb-3 flex items-center justify-between'>
                  <span className='text-gray-400'>{product.genre || '기타'}</span>
                  {product.category !== '웹툰' && (
                    <span className='font-bold'>{formatPriceInternal(product.price)} ETH</span>
                  )}
                </div>
                
                <button 
                  className='cursor-pointer w-full rounded-md bg-[#3cc3ec] py-2 font-medium hover:bg-blue-500 text-black cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation(); // 이벤트 버블링 중단
                    
                    // 자세한 디버깅 로그
                    console.log("=== 버튼 클릭 ===");
                    console.log("상품 데이터:", product);
                    console.log("ID:", product.id);
                    console.log("카테고리:", product.category);
                    
                    // 항상 이동 보장
                    try {
                      if (product.category === '웹툰') {
                        const targetId = product.id || product.webtoonId;
                        console.log(`웹툰 컬렉션 페이지로 이동 시도: /store/collection/${targetId}`);
                        if (targetId) {
                          navigate(`/store/collection/${targetId}`);
                        } else {
                          console.error("유효한 ID가 없어 이동할 수 없음");
                        }
                      } else {
                        const itemId = product.auctionItemId || product.id;
                        console.log(`상품 상세 페이지로 이동 시도: /store/product/${itemId}`);
                        if (itemId) {
                          navigate(`/store/product/${itemId}`);
                        } else {
                          console.error("유효한 ID가 없어 이동할 수 없음");
                        }
                      }
                    } catch (error) {
                      console.error("페이지 이동 중 오류:", error);
                    }
                  }}
                >
                  {product.category === '웹툰' ? '컬렉션 보기' : '상세 보기'}
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className='col-span-3 py-20 text-center text-gray-400'>
       </div>
      )}
    </div>
  );
};

export default ProductList