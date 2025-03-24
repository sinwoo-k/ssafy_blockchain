// // EpisodePurchaseModal.jsx
// import React, { useState, useEffect } from 'react'
// import { useSelector } from 'react-redux'
// import CloseIcon from '@mui/icons-material/Close'
// import StarIcon from '@mui/icons-material/Star'
// import BookmarkIcon from '@mui/icons-material/Bookmark'

// const EpisodePurchaseModal = ({ episode, onClose, onPurchase }) => {
//   const [currentPrice, setCurrentPrice] = useState(episode?.price || 0)
//   const [offerPrice, setOfferPrice] = useState(0.01)
//   const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  
//   // 가격 차트 데이터 - 실제로는 API에서 가져올 것
//   const priceData = [
//     { date: '1일전', price: episode?.price * 0.9 },
//     { date: '2일전', price: episode?.price * 0.88 },
//     { date: '3일전', price: episode?.price * 0.92 },
//     { date: '4일전', price: episode?.price * 0.86 },
//     { date: '5일전', price: episode?.price * 0.9 },
//     { date: '6일전', price: episode?.price * 0.95 },
//     { date: '7일전', price: episode?.price },
//     { date: '현재', price: episode?.price },
//   ]

//   // 제안가 변경 함수
//   const handleOfferChange = (e) => {
//     const value = parseFloat(e.target.value)
//     if (!isNaN(value) && value > 0) {
//       setOfferPrice(value)
//     }
//   }

//   // 제안가 증가 함수
//   const increaseOffer = () => {
//     setOfferPrice((prev) => parseFloat((prev + 0.01).toFixed(2)))
//   }

//   // 제안가 감소 함수
//   const decreaseOffer = () => {
//     if (offerPrice > 0.01) {
//       setOfferPrice((prev) => parseFloat((prev - 0.01).toFixed(2)))
//     }
//   }

//   // 구매 처리 함수
//   const handlePurchase = () => {
//     if (!isAuthenticated) {
//       alert('로그인이 필요한 서비스입니다.')
//       return
//     }
    
//     onPurchase(episode.id, currentPrice)
//     onClose()
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
//       <div className="relative w-[500px] rounded-lg bg-black text-white">
//         {/* 닫기 버튼 */}
//         <button 
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-white"
//         >
//           <CloseIcon />
//         </button>
        
//         {/* 헤더 */}
//         <div className="border-b border-gray-800 p-6 text-center">
//           <h2 className="text-2xl font-bold">{episode?.title || '웹툰 1화'}</h2>
//           <div className="mt-2 flex items-center justify-center text-sm">
//             <span>user1</span>
//             <span className="mx-2">|</span>
//             <span>seller: 99</span>
//             <span className="mx-2">|</span>
//             <StarIcon sx={{ fontSize: 18, color: '#ffff19' }} />
//             <span className="ml-1">4.9</span>
//           </div>
//         </div>
        
//         {/* 내용 */}
//         <div className="p-6">
//           <div className="mb-4 grid grid-cols-4 gap-4 text-center text-sm">
//             <div>
//               <div className="text-gray-400">현재 가격</div>
//               <div className="mt-1">{episode?.price.toFixed(2)} ETH</div>
//             </div>
//             <div>
//               <div className="text-gray-400">최초 가격</div>
//               <div className="mt-1">{episode?.price.toFixed(2)} ETH</div>
//             </div>
//             <div>
//               <div className="text-gray-400">변경점</div>
//               <div className="mt-1">{episode?.price.toFixed(2)} ETH</div>
//             </div>
//             <div>
//               <div className="text-gray-400">권장 가격</div>
//               <div className="mt-1">{episode?.price.toFixed(2)} ETH</div>
//             </div>
//           </div>
          
//           {/* 가격 차트 */}
//           <div className="relative mb-6 h-[100px]">
//             {/* 여기에 차트 SVG 또는 컴포넌트 */}
//             <div className="absolute bottom-0 right-0 flex items-center">
//               <div className="h-3 w-3 rounded-full bg-green-500"></div>
//               <span className="ml-2 text-sm">{priceData.length}일 간 거래가</span>
//             </div>
//           </div>
          
//           {/* 현재 가격 */}
//           <div className="mb-6 text-center">
//             <div className="text-3xl font-bold">
//               {episode?.price.toFixed(2)} ETH
//               <span className="ml-2 text-base text-gray-400">(≈ $200)</span>
//             </div>
//           </div>
          
//           {/* 제안 가격 입력 */}
//           <div className="mb-2">
//             <div className="mb-1 flex items-center justify-between">
//               <span className="text-sm text-gray-400">입찰 가격</span>
//               <span className="text-sm text-gray-400">보유 ETH: 0.01</span>
//             </div>
//             <div className="flex items-center">
//               <button 
//                 onClick={decreaseOffer}
//                 className="flex h-10 w-10 items-center justify-center rounded-l-md border border-gray-700 bg-gray-800"
//               >
//                 -
//               </button>
//               <input
//                 type="number"
//                 value={offerPrice}
//                 onChange={handleOfferChange}
//                 step="0.01"
//                 min="0.01"
//                 className="h-10 w-full border-y border-gray-700 bg-gray-800 px-3 text-center"
//               />
//               <button 
//                 onClick={increaseOffer}
//                 className="flex h-10 w-10 items-center justify-center rounded-r-md border border-gray-700 bg-gray-800"
//               >
//                 +
//               </button>
//             </div>
//           </div>
          
//           {/* 최종 제안가 */}
//           <div className="mb-6 flex items-center justify-between rounded bg-gray-800 p-2">
//             <span>최종 입찰가</span>
//             <div className="flex items-center">
//               <button 
//                 onClick={() => setOfferPrice((episode?.price || 0).toFixed(2))}
//                 className="mr-2 rounded bg-gray-700 px-2 py-1 text-xs"
//               >
//                 최대
//               </button>
//               <input
//                 type="number"
//                 value={offerPrice}
//                 onChange={handleOfferChange}
//                 className="w-24 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-right"
//               />
//               <span className="ml-1">ETH</span>
//             </div>
//           </div>
          
//           {/* 구매 버튼 */}
//           <button 
//             onClick={handlePurchase}
//             className="mb-2 w-full rounded-md bg-blue-500 py-3 font-semibold hover:bg-blue-600"
//           >
//             {(offerPrice || episode?.price).toFixed(2)} ETH 에 바로 구매하기
//           </button>
          
//           {/* 찜하기 버튼 */}
//           <button 
//             onClick={() => alert('찜 목록에 추가되었습니다.')}
//             className="flex w-full items-center justify-center rounded-md bg-gray-800 py-3 font-semibold hover:bg-gray-700"
//           >
//             <BookmarkIcon className="mr-2" />
//             찜하기
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EpisodePurchaseModal