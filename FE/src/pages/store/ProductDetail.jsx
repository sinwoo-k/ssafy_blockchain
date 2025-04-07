// ProductDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import { useSelector } from 'react-redux'
import BidHistoryModal from '../../components/store/BidHistoryModal'
import API from '../../api/API'
import { getEpisodeAuctions, getGoodsAuctions, getFanartAuctions, getNFTInfo } from '../../api/storeApi'

// 아이콘
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import StarIcon from '@mui/icons-material/Star'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import VisibilityIcon from '@mui/icons-material/Visibility'

const ProductDetail = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [auction, setAuction] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bidPrice, setBidPrice] = useState(0)
  const [bidHistory, setBidHistory] = useState([])
  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  
  // 경매 상세 정보 및 입찰 기록 로드
  useEffect(() => {
    const fetchAuctionDetail = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log('상품 ID:', productId);
        
        // localStorage에서 웹툰 ID 가져오기
        const currentWebtoonId = localStorage.getItem('currentWebtoonId');
        console.log('현재 웹툰 ID:', currentWebtoonId);
        
        if (!currentWebtoonId) {
          console.warn('웹툰 ID가 없습니다. 기본값 사용');
        }
        
        let auctionData = null;
        let auctionType = null;
        
        // 에피소드 경매 조회
        try {
          console.log('에피소드 경매 조회 시도');
          const episodeRes = await getEpisodeAuctions(currentWebtoonId || '1');
          
          if (episodeRes && episodeRes.content) {
            // auctionId 또는 auctionItemId로 매칭 시도
            const foundItem = episodeRes.content.find(
              item => String(item.auctionId) === String(productId) || String(item.auctionItemId) === String(productId)
            );
            
            if (foundItem) {
              console.log('에피소드 경매 찾음:', foundItem);
              auctionData = foundItem;
              auctionType = 'episode';
            }
          }
        } catch (episodeErr) {
          console.error('에피소드 경매 조회 오류:', episodeErr);
        }
        
        // 굿즈 경매 조회
        if (!auctionData) {
          try {
            console.log('굿즈 경매 조회 시도');
            const goodsRes = await getGoodsAuctions(currentWebtoonId || '1');
            
            if (goodsRes && goodsRes.content) {
              const foundItem = goodsRes.content.find(
                item => String(item.auctionId) === String(productId) || String(item.auctionItemId) === String(productId)
              );
              
              if (foundItem) {
                console.log('굿즈 경매 찾음:', foundItem);
                auctionData = foundItem;
                auctionType = 'goods';
              }
            }
          } catch (goodsErr) {
            console.error('굿즈 경매 조회 오류:', goodsErr);
          }
        }
        
        // 팬아트 경매 조회
        if (!auctionData) {
          try {
            console.log('팬아트 경매 조회 시도');
            const fanartRes = await getFanartAuctions(currentWebtoonId || '1');
            
            if (fanartRes && fanartRes.content) {
              const foundItem = fanartRes.content.find(
                item => String(item.auctionId) === String(productId) || String(item.auctionItemId) === String(productId)
              );
              
              if (foundItem) {
                console.log('팬아트 경매 찾음:', foundItem);
                auctionData = foundItem;
                auctionType = 'fanart';
              }
            }
          } catch (fanartErr) {
            console.error('팬아트 경매 조회 오류:', fanartErr);
          }
        }
        
        // 다른 API로도 시도 (만약 웹툰 ID가 없거나 다를 경우)
        if (!auctionData) {
          try {
            console.log('직접 API 호출 시도');
            const response = await API.get(`/auctions/item/${productId}`);
            if (response.data) {
              console.log('직접 API로 경매 찾음:', response.data);
              auctionData = response.data;
              
              // 응답 데이터에서 타입 추론
              if (auctionData.episodeId || auctionData.episodeNumber) {
                auctionType = 'episode';
              } else if (auctionData.goodsId) {
                auctionType = 'goods';
              } else if (auctionData.fanartId) {
                auctionType = 'fanart';
              }
            }
          } catch (directErr) {
            console.error('직접 API 호출 오류:', directErr);
          }
        }
        
        // 경매 데이터 확인
        if (auctionData) {
          console.log('최종 경매 데이터:', auctionData, '타입:', auctionType);
          
          // NFT 정보 조회 (있는 경우)
          if (auctionData.nftId) {
            try {
              const nftInfo = await getNFTInfo(auctionData.nftId);
              if (nftInfo) {
                // NFT 정보 병합
                auctionData = {
                  ...auctionData,
                  title: nftInfo.title || auctionData.title,
                  description: nftInfo.description,
                  image: nftInfo.image
                };
              }
            } catch (nftErr) {
              console.error('NFT 정보 조회 오류:', nftErr);
            }
          }
          
          // 기본 필드 확인 및 설정
          const processedAuction = {
            ...auctionData,
            type: auctionType,
            imageUrl: auctionData.imageUrl || auctionData.thumbnailUrl || auctionData.image,
            biddingPrice: auctionData.biddingPrice || auctionData.currentPrice || auctionData.startingPrice || 0,
            buyNowPrice: auctionData.buyNowPrice || auctionData.immediatePrice || 0,
            title: auctionData.title || (auctionType === 'episode' ? `${auctionData.episodeNumber || ''}화` : '상품'),
            genre: auctionData.genre || '기타',
            webtoonId: auctionData.webtoonId || currentWebtoonId || '1'
          };
          
          setAuction(processedAuction);
          
          // 초기 입찰가 설정 (현재 입찰가 또는 시작가)
          const currentBid = processedAuction.biddingPrice;
          setBidPrice(parseFloat(currentBid) + 0.01); // 현재 가격보다 0.01 ETH 높게 설정
          
          // 입찰 기록 API 호출
          try {
            const historyResponse = await API.get(`/auctions/${productId}/bidding-history`);
            const historyData = historyResponse.data.content || [];
            setBidHistory(historyData);
          } catch (historyError) {
            console.error('입찰 기록 로드 오류:', historyError);
            setBidHistory([]);
          }
        } else {
          throw new Error('상품 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('경매 상세 정보 로드 오류:', err);
        setError(err.message || '경매 상세 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuctionDetail();
  }, [productId]);

  // 입찰가 변경 함수
  const handleBidChange = (e) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value) && value > 0) {
      setBidPrice(value)
    }
  }

  // 입찰가 증가 함수
  const increaseBid = () => {
    const bidIncrement =.01 // 최소 입찰 단위
    setBidPrice((prev) => parseFloat((prev + bidIncrement).toFixed(2)))
  }

  // 입찰가 감소 함수
  const decreaseBid = () => {
    const bidIncrement = .01
    const minBid = parseFloat(auction?.biddingPrice || 0) + .01
    if (bidPrice > minBid) {
      setBidPrice((prev) => parseFloat((prev - bidIncrement).toFixed(2)))
    }
  }

  // 입찰하기 함수
  const handleBid = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.')
      return
    }
    
    const minBid = parseFloat(auction?.biddingPrice || 0) + 0.01
    if (bidPrice < minBid) {
      alert(`현재 입찰가(${auction.biddingPrice} ETH)보다 높은 금액을 입력해주세요.`)
      return
    }
    
    try {
      setIsProcessing(true)
      
      // 입찰 API 호출
      await API.post('/auctions/bid', { 
        auctionItemId: productId,
        biddingPrice: bidPrice 
      })
      
      // 입찰 성공 처리
      alert(`${bidPrice} ETH 금액으로 입찰이 완료되었습니다!`)
      
      // 경매 정보 새로고침
      window.location.reload();
      
    } catch (err) {
      console.error('입찰 처리 중 오류:', err)
      alert('입찰 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsProcessing(false)
    }
  }
  
  // 즉시 구매 함수
  const handleImmediatePurchase = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.')
      return
    }
    
    if (!auction?.buyNowPrice) {
      alert('즉시 구매 가격이 설정되지 않았습니다.')
      return
    }
    
    if (!window.confirm(`${auction.buyNowPrice} ETH에 즉시 구매하시겠습니까?`)) {
      return
    }
    
    try {
      setIsProcessing(true)
      
      // 즉시 구매 API 호출
      await API.post('/auctions/buy-now', { auctionItemId: productId })
      
      // 구매 성공 처리
      alert(`${auction.buyNowPrice} ETH 금액으로 즉시 구매가 완료되었습니다!`)
      
      // 구매 후 컬렉션 페이지로 이동
      navigate(`/store/collection/${auction.webtoonId}`)
      
    } catch (err) {
      console.error('즉시 구매 처리 중 오류:', err)
      alert('즉시 구매 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsProcessing(false)
    }
  }
  
  // 입찰 기록 모달 표시/숨김 처리
  const handleToggleBidHistoryModal = () => {
    setShowBidHistoryModal(!showBidHistoryModal);
  };
  
  // 찜하기 처리 함수
  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.')
      return
    }
    
    try {
      await API.post(`/auctions/${productId}/wishlist`)
      alert('찜 목록에 추가되었습니다.')
    } catch (err) {
      console.error('찜하기 처리 중 오류:', err)
      alert('찜하기 처리 중 오류가 발생했습니다.')
    }
  }

  if (isLoading) {
    return <Loader />
  }
  
  if (error || !auction) {
    return (
      <div className='min-h-screen bg-black pt-[100px] pb-10 text-text/85'>
        <div className='mx-auto w-[1160px] text-center'>
          <h1 className='text-2xl'>{error || '경매 정보를 찾을 수 없습니다.'}</h1>
          <Link to="/store" className='mt-4 inline-block rounded bg-blue-600 px-6 py-2'>
            스토어로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  // 경매 종료 여부 체크
  const isAuctionEnded = auction.ended === 'Y'
  
  // 경매 남은 시간 계산
  const calculateTimeLeft = () => {
    if (!auction.endTime) return '정보 없음'
    
    const endTime = new Date(auction.endTime)
    const now = new Date()
    
    if (now >= endTime || isAuctionEnded) return '경매 종료'
    
    const diffTime = endTime - now
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${days}일 ${hours}시간 ${minutes}분`
  }
  
  // 상품 타입에 따른 카테고리 표시
  const getCategory = () => {
    const types = {
      'episode': '웹툰회차',
      'goods': '굿즈',
      'fanart': '팬아트'
    }
    return types[auction.type] || '상품'
  }
  
  // 경매 상품 제목 가져오기
  const getTitle = () => {
    if (auction.type === 'episode') {
      return auction.title || `${auction.episodeNumber || ''}화`
    }
    return auction.title || '상품'
  }

  // 가격 형식 포맷팅
  const formatPrice = (price) => {
    if (!price) return '0.00'
    return parseFloat(price).toFixed(2)
  }
  
  // USD 가치 계산 (예시 - 실제 환율 적용 필요)
  const getUSDValue = (ethPrice) => {
    const ethToUsd = 1840 // 예시 환율
    return (parseFloat(ethPrice) * ethToUsd).toFixed(2)
  }

  return (
    <div className='min-h-screen bg-black pt-[100px] pb-10 text-text/85'>
      <div className='mx-auto w-[1160px]'>
        {/* 뒤로가기 버튼 */}
        <div className='mb-6'>
          <Link 
            to={auction.type === 'episode' ? `/store/collection/${auction.webtoonId}` : '/store'} 
            className='flex items-center text-gray-400 hover:text-white'
          >
            <ArrowBackIcon />
            <span className='ml-1'>
              {auction.type === 'episode' ? '웹툰으로 돌아가기' : '스토어로 돌아가기'}
            </span>
          </Link>
        </div>

        {/* 상품 정보 섹션 */}
        <div className='mb-10 flex gap-10'>
          {/* 상품 이미지 */}
          <div className='w-[400px]'>
            <img 
              src={auction.imageUrl || auction.thumbnailUrl || auction.image} 
              alt={getTitle()} 
              className='h-[400px] w-full rounded-lg object-cover' 
            />
            {isAuctionEnded && (
              <div className='mt-4 rounded bg-red-500 p-3 text-center text-white'>
                현재 판매가 종료된 상품입니다.
              </div>
            )}

            {/* 정보 아이콘들 */}
            <div className='mt-4 flex items-center justify-evenly rounded bg-gray-800 p-3'>
              <div className='flex items-center gap-1'>
                <FavoriteIcon sx={{ fontSize: 20, color: '#ff1919' }} />
                <span className='text-sm'>{auction.wishlistCount || 0}</span>
              </div>
              <div className='flex items-center gap-1'>
                <VisibilityIcon sx={{ fontSize: 20, color: '#3cc3ec' }} />
                <span className='text-sm'>{auction.viewCount || 0}</span>
              </div>
              <div className='flex items-center gap-1'>
                <StarIcon sx={{ fontSize: 20, color: '#ffff19' }} />
                <span className='text-sm'>{auction.rating || 0}</span>
              </div>
            </div>
          </div>

          {/* 상품 상세 정보 */}
          <div className='flex flex-1 flex-col'>
            <div className='mb-2 text-gray-400'>{getCategory()} | {auction.genre || '기타'}</div>
            <h1 className='mb-4 text-3xl font-bold'>{getTitle()}</h1>
            
            {/* 남은 시간 표시 */}
            <div className='mb-4 rounded-lg bg-gray-800 p-3'>
              <div className='flex items-center justify-between'>
                <span className='text-gray-400'>남은 시간</span>
                <span className='font-medium'>{calculateTimeLeft()}</span>
              </div>
            </div>
            
            {/* 가격 정보 */}
            <div className='mb-3'>
              <div className='text-xl font-bold'>현재 가격</div>
              <div className='mb-6 text-3xl font-bold'>
                {formatPrice(auction.biddingPrice)} ETH 
                <span className='ml-2 text-sm text-gray-400'>
                  ($ {getUSDValue(auction.biddingPrice)})
                </span>
              </div>
            </div>
            
            {/* 거래기록, 입찰단위, 희망 입찰가 섹션 */}
            <div className='mb-6 rounded-lg bg-gray-800 p-4'>
              {/* 거래 기록 */}
              <div className='mb-4 flex items-center justify-between'>
                <div className='text-lg font-medium'>거래 기록</div>
                <div className='flex items-center'>
                  <span className='mr-2'>거래내역 조회</span>
                  <button 
                    onClick={handleToggleBidHistoryModal}
                    className='text-[#3cc3ec] hover:text-[#2aabda]'
                  >
                    [기록보기]
                  </button>
                </div>
              </div>
              
              {/* 입찰 단위 표시 */}
              <div className='mb-4'>
                <div className='mb-2 text-sm text-gray-400'>입찰 단위</div>
                <div className='bg-gray-700 px-3 py-2 rounded text-sm inline-block'>
                  0.01 ETH
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
                    disabled={isAuctionEnded || isProcessing}
                  >
                    -
                  </button>
                  <input
                    type='number'
                    value={bidPrice}
                    onChange={handleBidChange}
                    step={0.01}
                    min={parseFloat(auction.biddingPrice) + 0.01}
                    className='h-10 w-full border-y border-gray-700 bg-gray-900 px-3 text-center'
                    disabled={isAuctionEnded || isProcessing}
                  />
                  <button 
                    onClick={increaseBid}
                    className='flex h-10 w-10 items-center justify-center rounded-r-md border border-gray-700 bg-gray-900'
                    disabled={isAuctionEnded || isProcessing}
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
                  onClick={() => setBidPrice(parseFloat(auction.biddingPrice) + 0.01)}
                  className='mr-2 rounded bg-gray-700 px-2 py-1 text-xs'
                  disabled={isAuctionEnded || isProcessing}
                >
                  최소
                </button>
                <input
                  type='number'
                  value={bidPrice}
                  onChange={handleBidChange}
                  className='w-24 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-right'
                  disabled={isAuctionEnded || isProcessing}
                />
                <span className='ml-1'>ETH</span>
              </div>
            </div>
            
            {/* 입찰/찜 버튼 */}
            <div className='flex gap-3'>
              <button 
                className='flex-1 rounded-md bg-gray-700 py-3 px-6 text-lg font-medium hover:bg-gray-600'
                onClick={handleAddToWishlist}
                disabled={isAuctionEnded || isProcessing}
              >
                <BookmarkIcon className='mr-2' />
                찜하기
              </button>
              <button 
                className={`flex-1 rounded-md py-3 px-6 text-lg font-medium ${
                  isAuctionEnded || isProcessing
                    ? 'cursor-not-allowed bg-gray-500' 
                    : 'bg-[#3cc3ec] hover:bg-[#2aabda]'
                }`}
                onClick={handleBid}
                disabled={isAuctionEnded || isProcessing}
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
            {auction.buyNowPrice && (
              <button 
                className={`mt-3 w-full rounded-md py-3 px-6 text-lg font-medium ${
                  isAuctionEnded || isProcessing
                    ? 'cursor-not-allowed bg-gray-500' 
                    : 'bg-blue-500 hover:bg-blue-400'
                }`}
                onClick={handleImmediatePurchase}
                disabled={isAuctionEnded || isProcessing}
              >
                <ShoppingCartIcon className='mr-2' />
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <span className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
                    처리 중...
                  </span>
                ) : (
                  <span>{formatPrice(auction.buyNowPrice)} ETH 에 즉시 구매하기</span>
                )}
              </button>
            )}
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
            <p className='mb-4 text-gray-300'>
              {auction.description || `이 ${getCategory()}는 NFT로 제작되어 블록체인에 기록되며, 디지털 자산으로서의 가치와 희소성을 지니고 있습니다.`}
            </p>
            
            <div className='mt-4 grid grid-cols-2 gap-4'>
              <div className='rounded-md bg-gray-800 p-4'>
                <h3 className='mb-2 text-lg font-medium'>작가 정보</h3>
                <div className='flex items-center'>
                  <div className='mr-3 h-12 w-12 rounded-full bg-gray-700'></div>
                  <div>
                    <div className='font-medium'>{auction.artist || auction.author || '작가 정보 없음'}</div>
                    <div className='text-sm text-gray-400'>
                      {auction.type === 'episode' ? '웹툰 작가' : auction.type === 'fanart' ? '팬아트 작가' : '제작자'}
                    </div>
                  </div>
                </div>
              </div>
              <div className='rounded-md bg-gray-800 p-4'>
                <h3 className='mb-2 text-lg font-medium'>출시 정보</h3>
                <div className='text-gray-300'>
                  <p>등록일: {auction.createdAt ? new Date(auction.createdAt).toLocaleDateString() : '정보 없음'}</p>
                  <p>NFT ID: {auction.nftId || '정보 없음'}</p>
                  <p>판매 형태: NFT 경매</p>
                  <p>판매 플랫폼: 체인툰</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 입찰 기록 모달 컴포넌트 */}
        <BidHistoryModal 
          isOpen={showBidHistoryModal}
          onClose={handleToggleBidHistoryModal}
          auctionItemId={productId}
        />
      </div>
    </div>
  )
}

export default ProductDetail