// NFTCreateModal.jsx → 버튼 모달 제거 & API 연동
import React from 'react'
import { nftService } from '../../api/nftApi'
import { useSelector } from 'react-redux'

const NFTCreateModal = ({ item, type, setShowModal }) => {
  const userData = useSelector((state) => state.user.userData)

  const handleMint = async () => {
    try {
      const payload = {
        webtoonId: item.webtoonId || item.webtoon?.webtoonId, // 웹툰 ID
        type: type, // 'fanart' | 'goods' | 'webtoon'
        typeId: item.fanartId || item.goodsId || item.webtoonId // 실제 아이템 ID
      }

      await nftService.sellNFT(payload)
      alert('NFT 발행 완료')
      setShowModal(false)
    } catch (err) {
      console.error('NFT 발행 실패:', err)
      alert('NFT 발행 중 오류가 발생했습니다')
    }
  }

  return (
    <button
      className='text-chaintoon hover:text-white border border-chaintoon px-4 py-1 rounded'
      onClick={handleMint}
    >
      NFT 발행하기
    </button>
  )
}

export default NFTCreateModal
