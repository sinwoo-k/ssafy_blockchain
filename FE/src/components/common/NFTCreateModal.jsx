import React, { useState } from 'react'

const NFTCreateModal = ({ item, type, setShowModal }) => {
  // 각 입력 필드를 위한 state
  const [imageFile, setImageFile] = useState(null)
  const [intro, setIntro] = useState('')
  const [quantity, setQuantity] = useState('')

  return (
    <div className='fixed top-0 left-0 z-50'>
      {/* 모달 배경 */}
      <div
        className='bg-text/30 fixed flex h-full w-full items-center justify-center'
        onClick={() => setShowModal(false)}
      >
        {/* 모달 컨테이너 */}
        <div
          className='flex flex-col rounded-xl bg-black px-10 py-5'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='w-[300px]'>
            <h1 className='text-xl'>NFT 발행</h1>
            {/* 아이템 소개 */}
            <div className='mt-4'>
              <label className='mb-2 block text-white'>NFT 명</label>
              <input
                type='text'
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                className='bg-text/30 w-full rounded-md p-2 text-white focus:outline-none'
                placeholder='NFT명을 입력하세요'
              />
            </div>

            {/* 판매 수량 */}
            <div className='mt-4'>
              <label className='mb-2 block text-white'>판매 수량</label>
              <input
                type='number'
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className='bg-text/30 w-full rounded-md p-2 text-white focus:outline-none'
                placeholder='판매 수량을 입력하세요'
              />
            </div>
          </div>

          {/* 버튼 구역 */}
          <div className='flex justify-center gap-10 py-3'>
            {/* 등록 버튼 */}
            <button className='text-chaintoon cursor-pointer'>등록</button>
            {/* 닫기 버튼 */}
            <button
              className='cursor-pointer text-red-600'
              onClick={() => setShowModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTCreateModal
