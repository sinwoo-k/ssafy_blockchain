// ProductDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import { useSelector } from 'react-redux'
import { dummyProducts } from './storeData'

// 아이콘
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import StarIcon from '@mui/icons-material/Star'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import VisibilityIcon from '@mui/icons-material/Visibility'
import HistoryIcon from '@mui/icons-material/History'
import CloseIcon from '@mui/icons-material/Close'

// 더미 입찰 기록 생성 함수
const generateBidHistory = (basePrice) => {
  const history = [];
  const baseDate = new Date();
  
  for(let i = 0; i < 10; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // 랜덤 가격 (기본 가격의 ±10% 범위 내)
    const price = basePrice * (0.9 + Math.random() * 0.2);
    // 랜덤 사용자
    const user = `user${Math.floor(Math.random() * 100)}`;
    
    history.push({
      id: i + 1,
      date: formattedDate,
      user,
      price: price.toFixed(2)
    });
  }
  
  return history;
};

const ProductDetail = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedOption, setSelectedOption] = useState('')
  const [bidPrice, setBidPrice] = useState(0)
  const [bidHistory, setBidHistory] = useState([])
  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  // 상품 정보 불러오기
  useEffect(() => {
    // API 호출 지연 시뮬레이션
    setTimeout(() => {
      // 먼저 웹툰 회차 검색
      let foundProduct = null;
      
      // 상품 ID가 100 이상이면 에피소드로 간주 (예시)
      if (parseInt(productId) >= 100) {
        // 웹툰 회차 더미 데이터 생성
        foundProduct = {
          id: parseInt(productId),
          title: `웹툰 ${Math.floor((parseInt(productId) - 100) / 15) + 1}화`,
          category: '웹툰회차',
          price: 8.92, // ETH 가격
          immediatePrice: 13.00, // 즉시 구매가
          bidIncrement: 0.01, // 입찰 단위
          image: `/api/placeholder/300/${320 + parseInt(productId) % 15}`,
          uploadDate: `2025-0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 28) + 1}`,
          status: Math.random() > 0.2 ? 'sell' : 'notsell',
          author: '작가' + Math.floor(Math.random() * 10 + 1),
          description: '이 에피소드는 주인공의 새로운 모험을 담고 있습니다. 흥미진진한 스토리와 멋진 작화를 함께 즐겨보세요.',
          rating: 4.9,
          reviewCount: 88,
          genre: ['판타지', '액션', '모험'][Math.floor(Math.random() * 3)],
          webtoonId: Math.floor((parseInt(productId) - 100) / 15) + 1
        };
      } else {
        // 일반 상품 검색
        foundProduct = dummyProducts.find(p => p.id === parseInt(productId));
        
        if (foundProduct) {
          // 실제 API에서는 받아오지 않을 추가 정보
          foundProduct = {
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
              id: foundProduct.collectionId || 1,
              title: `${foundProduct.genre} 웹툰`,
              author: '작가 이름'
            }
          };
        }
      }
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // 웹툰 회차인 경우 입찰 기록 생성 및 초기 입찰가 설정
        if (foundProduct.category === '웹툰회차') {
          const history = generateBidHistory(foundProduct.price);
          setBidHistory(history);
          setBidPrice(foundProduct.price);
        }
      }
      
      setIsLoading(false);
    }, 800);
  }, [productId]);

  // 수량 변경 핸들러
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0 && value <= 10) {
      setQuantity(value)
    }
  }

  // 수량 증가 핸들러
  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1)
    }
  }

  // 수량 감소 핸들러
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }
  
  // 입찰가 변경 함수 (웹툰 회차용)
  const handleBidChange = (e) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value) && value > 0) {
      setBidPrice(value)
    }
  }

  // 입찰가 증가 함수 (웹툰 회차용)
  const increaseBid = () => {
    // 상품에 설정된 입찰 단위가 있으면 사용, 없으면 기본값 0.01 사용
    const bidIncrement = product.bidIncrement || 0.01;
    setBidPrice((prev) => parseFloat((prev + bidIncrement).toFixed(2)))
  }

  // 입찰가 감소 함수 (웹툰 회차용)
  const decreaseBid = () => {
    const bidIncrement = product.bidIncrement || 0.01;
    if (bidPrice > bidIncrement) {
      setBidPrice((prev) => parseFloat((prev - bidIncrement).toFixed(2)))
    }
  }

  // 입찰하기 함수
  const handleBid = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    
    setIsProcessing(true);
    
    // 처리 지연 시뮬레이션
    setTimeout(() => {
      alert(`${bidPrice} ETH 금액으로 입찰이 완료되었습니다!`);
      
      // 입찰 기록에 새 항목 추가 (임시)
      const newBid = {
        id: bidHistory.length + 1,
        date: new Date().toISOString().split('T')[0],
        user: 'me',
        price: bidPrice.toFixed(2)
      };
      
      setBidHistory([newBid, ...bidHistory]);
      setIsProcessing(false);
    }, 1000);
  }
  
  // 즉시 구매 함수
  const handleImmediatePurchase = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    
    setIsProcessing(true);
    
    // 처리 지연 시뮬레이션
    setTimeout(() => {
      alert(`${product.immediatePrice} ETH 금액으로 즉시 구매가 완료되었습니다!`);
      setIsProcessing(false);
    }, 1000);
  }

  // 일반 상품 구매 처리 함수
  const handlePurchase = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    
    if (!selectedOption && product.options && product.options.length > 0) {
      alert('옵션을 선택해주세요');
      return;
    }
    
    setIsProcessing(true);
    
    // 처리 지연 시뮬레이션
    setTimeout(() => {
      alert(`상품 구매가 완료되었습니다! (${product.price * quantity} ETH)`);
      setIsProcessing(false);
    }, 1000);
  }

  // 찜하기 처리 함수
  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    
    alert('찜 목록에 추가되었습니다.');
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

  // 웹툰 회차 구매 페이지 렌더링
  if (product.category === '웹툰회차') {
    return (
      <div className='min-h-screen bg-black pt-[100px] pb-10 text-text/85'>
        <div className='mx-auto w-[1160px]'>
          {/* 뒤로가기 버튼 */}
          <div className='mb-6'>
            <Link to={`/store/collection/${product.webtoonId}`} className='flex items-center text-gray-400 hover:text-white'>
              <ArrowBackIcon />
              <span className='ml-1'>웹툰으로 돌아가기</span>
            </Link>
          </div>

          {/* 상품 정보 섹션 */}
          <div className='mb-10 flex gap-10'>
            {/* 상품 이미지 */}
            <div className='w-[400px]'>
              <img 
                src={product.image} 
                alt={product.title} 
                className='h-[400px] w-full rounded-lg object-cover' 
              />
              {product.status === 'notsell' && (
                <div className='mt-4 rounded bg-red-500 p-3 text-center text-white'>
                  현재 판매가 종료된 회차입니다.
                </div>
              )}

              {/* 정보 아이콘들 */}
              <div className='mt-4 flex items-center justify-evenly rounded bg-gray-800 p-3'>
                <div className='flex items-center gap-1'>
                  <FavoriteIcon sx={{ fontSize: 20, color: '#ff1919' }} />
                  <span className='text-sm'>{Math.floor(Math.random() * 500) + 100}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <VisibilityIcon sx={{ fontSize: 20, color: '#3cc3ec' }} />
                  <span className='text-sm'>{Math.floor(Math.random() * 10) + 1}K</span>
                </div>
                <div className='flex items-center gap-1'>
                  <StarIcon sx={{ fontSize: 20, color: '#ffff19' }} />
                  <span className='text-sm'>{product.rating}</span>
                </div>
              </div>
            </div>

            {/* 상품 상세 정보 */}
            <div className='flex flex-1 flex-col'>
              <div className='mb-2 text-gray-400'>웹툰 회차 | {product.genre}</div>
              <h1 className='mb-4 text-3xl font-bold'>{product.title}</h1>
              
              {/* 가격 정보 */}
              <div className='mb-3'>
                <div className='text-xl font-bold'>현재 가격</div>
                <div className='mb-6 text-3xl font-bold'>
                  {product.price.toFixed(2)} ETH 
                  <span className='text-sm text-gray-400 ml-2'>($ 8.30)</span>
                </div>
              </div>
              
              {/* 거래기록, 입찰단위, 희망 입찰가 섹션 */}
              <div className='mb-6 rounded-lg bg-gray-800 p-4'>
                {/* 거래 기록 */}
                <div className='mb-4 flex items-center justify-between'>
                  <div className='text-lg font-medium'>거래 기록</div>
                  <button 
                    onClick={() => setShowBidHistoryModal(true)}
                    className='flex items-center text-sm text-[#3cc3ec] hover:text-[#2aabda]'
                  >
                    <HistoryIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
                    기록보기
                  </button>
                </div>
                
                {/* 입찰 단위 표시 */}
                <div className='mb-4'>
                  <div className='mb-2 text-sm text-gray-400'>입찰 단위</div>
                  <div className='bg-gray-700 px-3 py-2 rounded text-sm inline-block'>
                    {(product.bidIncrement || 0.01).toFixed(2)} ETH
                  </div>
                </div>
                
                {/* 희망 입찰가 */}
                <div>
                  <div className='mb-2 text-sm text-gray-400'>희망 입찰가</div>
                  <div className='mb-1 flex items-center justify-between'>
                    <span className='text-sm text-gray-400'>입찰 가격</span>
                    <span className='text-sm text-gray-400'>보유 ETH: 0.01</span>
                  </div>
                  <div className='flex items-center'>
                    <button 
                      onClick={decreaseBid}
                      className='flex h-10 w-10 items-center justify-center rounded-l-md border border-gray-700 bg-gray-900'
                      disabled={product.status === 'notsell' || isProcessing}
                    >
                      -
                    </button>
                    <input
                      type='number'
                      value={bidPrice}
                      onChange={handleBidChange}
                      step={product.bidIncrement || 0.01}
                      min={product.bidIncrement || 0.01}
                      className='h-10 w-full border-y border-gray-700 bg-gray-900 px-3 text-center'
                      disabled={product.status === 'notsell' || isProcessing}
                    />
                    <button 
                      onClick={increaseBid}
                      className='flex h-10 w-10 items-center justify-center rounded-r-md border border-gray-700 bg-gray-900'
                      disabled={product.status === 'notsell' || isProcessing}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 최종 희망 입찰가 */}
              <div className='mb-6 flex items-center justify-between rounded bg-gray-800 p-3'>
                <span>최종 입찰가</span>
                <div className='flex items-center'>
                  <button 
                    onClick={() => setBidPrice(product.price)}
                    className='mr-2 rounded bg-gray-700 px-2 py-1 text-xs'
                    disabled={product.status === 'notsell' || isProcessing}
                  >
                    최대
                  </button>
                  <input
                    type='number'
                    value={bidPrice}
                    onChange={handleBidChange}
                    className='w-24 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-right'
                    disabled={product.status === 'notsell' || isProcessing}
                  />
                  <span className='ml-1'>ETH</span>
                </div>
              </div>
              
              {/* 입찰 버튼 */}
              <div className='flex gap-3'>
                <button 
                  className='flex-1 rounded-md bg-gray-700 py-3 px-6 text-lg font-medium hover:bg-gray-600'
                  onClick={handleAddToWishlist}
                  disabled={product.status === 'notsell' || isProcessing}
                >
                  <BookmarkIcon className='mr-2' />
                  찜하기
                </button>
                <button 
                  className={`flex-1 rounded-md py-3 px-6 text-lg font-medium ${
                    product.status === 'notsell' || isProcessing
                      ? 'cursor-not-allowed bg-gray-500' 
                      : 'bg-[#3cc3ec] hover:bg-[#2aabda]'
                  }`}
                  onClick={handleBid}
                  disabled={product.status === 'notsell' || isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <span className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
                      처리 중...
                    </span>
                  ) : (
                    <span>입찰하기</span>
                  )}
                </button>
              </div>
              
              {/* 즉시 구매 버튼 */}
              <button 
                className={`mt-3 w-full rounded-md py-3 px-6 text-lg font-medium ${
                  product.status === 'notsell' || isProcessing
                    ? 'cursor-not-allowed bg-gray-500' 
                    : 'bg-blue-500 hover:bg-blue-400'
                }`}
                onClick={handleImmediatePurchase}
                disabled={product.status === 'notsell' || isProcessing}
              >
                <ShoppingCartIcon className='mr-2' />
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <span className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
                    처리 중...
                  </span>
                ) : (
                  <span>{product.immediatePrice.toFixed(2)} ETH 에 즉시 구매하기</span>
                )}
              </button>
            </div>
          </div>
          
          {/* 상품 상세 정보 탭 */}
          <div className='mb-10'>
            <div className='mb-4 border-b border-gray-700'>
              <button className='border-b-2 border-blue-500 py-3 px-6 text-lg font-medium'>
                상세정보
              </button>
            </div>
            
            <div className='rounded-lg bg-gray-900 p-6'>
              <h2 className='mb-4 text-xl font-medium'>에피소드 정보</h2>
              <p className='mb-4 text-gray-300'>{product.description}</p>
              
              <div className='mt-4 grid grid-cols-2 gap-4'>
                <div className='rounded-md bg-gray-800 p-4'>
                  <h3 className='mb-2 text-lg font-medium'>작가 정보</h3>
                  <div className='flex items-center'>
                    <div className='mr-3 h-12 w-12 rounded-full bg-gray-700'></div>
                    <div>
                      <div className='font-medium'>{product.author}</div>
                      <div className='text-sm text-gray-400'>웹툰 작가</div>
                    </div>
                  </div>
                </div>
                <div className='rounded-md bg-gray-800 p-4'>
                  <h3 className='mb-2 text-lg font-medium'>출시 정보</h3>
                  <div className='text-gray-300'>
                    <p>출시일: {product.uploadDate}</p>
                    <p>판매 형태: NFT</p>
                    <p>판매 플랫폼: 체인툰</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 입찰 기록 모달 */}
          {showBidHistoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
              <div className="w-[500px] rounded-lg bg-[#1a1a1a] p-5 text-white shadow-xl">
                {/* 모달 헤더 */}
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">입찰 기록</h2>
                  <button 
                    onClick={() => setShowBidHistoryModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <CloseIcon />
                  </button>
                </div>
                
                {/* 입찰 기록 테이블 */}
                <div className="mb-4 max-h-[400px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-700">
                      <tr>
                        <th className="p-2 text-left">#</th>
                        <th className="p-2 text-left">입찰 일자</th>
                        <th className="p-2 text-left">사용자</th>
                        <th className="p-2 text-right">가격</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bidHistory.map((record) => (
                        <tr key={record.id} className="border-b border-gray-800">
                          <td className="p-2">{record.id}</td>
                          <td className="p-2">{record.date}</td>
                          <td className="p-2">{record.user}</td>
                          <td className="p-2 text-right">{record.price} ETH</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* 페이지네이션 (예시) */}
                <div className="flex justify-center">
                  <button className="mx-1 rounded-md bg-gray-800 px-3 py-1 hover:bg-gray-700">1</button>
                  <button className="mx-1 rounded-md bg-gray-700 px-3 py-1 hover:bg-gray-600">2</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 일반 상품(굿즈, 팬아트 등) 페이지 렌더링
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
              <span className='text-3xl font-bold'>{product.price.toFixed(2)} ETH</span>
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
                disabled={product.status === 'notsell' || isProcessing}
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
                  disabled={product.status === 'notsell' || isProcessing}
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
                  disabled={product.status === 'notsell' || isProcessing}
                />
                <button 
                  onClick={increaseQuantity}
                  className='flex h-full w-[50px] items-center justify-center rounded-r-md border border-l-0 border-gray-700 bg-gray-800 text-xl'
                  disabled={product.status === 'notsell' || isProcessing}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* 총 금액 */}
            <div className='mb-6 flex items-center justify-between border-y border-gray-700 py-4'>
              <span className='text-xl'>총 금액</span>
              <span className='text-2xl font-bold'>
                {(product.price * quantity).toFixed(2)} ETH
              </span>
            </div>
            
            {/* 구매 버튼 */}
            <div className='flex gap-3'>
              <button 
                className='flex-1 rounded-md bg-gray-700 py-3 px-6 text-lg font-medium hover:bg-gray-600'
                onClick={handleAddToWishlist}
                disabled={product.status === 'notsell' || isProcessing}
              >
                <FavoriteIcon className='mr-2' />
                찜하기
              </button>
              <button 
                className={`flex-1 rounded-md py-3 px-6 text-lg font-medium ${
                  product.status === 'notsell' || isProcessing
                    ? 'cursor-not-allowed bg-gray-500' 
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
                onClick={handlePurchase}
                disabled={product.status === 'notsell' || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <span className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
                    처리 중...
                  </span>
                ) : (
                  <>
                    <ShoppingCartIcon className='mr-2' />
                    바로 구매하기
                  </>
                )}
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
                  to={`/store/collection/${product.relatedWebtoon.id}`}
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