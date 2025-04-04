import React from 'react'

const NoticeCard = ({ notice, onDelete, onUpdate }) => {
  // type에 따라 제목을 반환하는 헬퍼 함수
  const getNoticeTitle = (notice) => {
    switch (notice.type) {
      case 'SECONDARY_CREATE':
        return '2차 창작 등록'
      case 'OVERBID':
        return '입찰 초과'
      case 'NFT_PURCHASE':
        return 'NFT 구매'
      case 'NFT_SOLD':
        return 'NFT 판매'
      case 'SECONDARY_CREATION_NFT_SOLD':
        return '2차 창작 NFT 판매'
      case 'BLOCKCHAIN_NETWORK_SUCCESS':
        return '블록체인 네트워크 성공'
      case 'BLOCKCHAIN_NETWORK_FAIL':
        return '블록체인 네트워크 실패'
      case 'SECONDARY_CREATION_NFT_MINT':
        return '2차 창작 NFT 발행'
      default:
        return '알림'
    }
  }

  // type과 metadata에 따라 상세 메시지를 반환하는 헬퍼 함수
  const getNoticeMessage = (notice) => {
    switch (notice.type) {
      case 'SECONDARY_CREATE':
        return `웹툰 ${notice.metadata.webtoonId}의 2차 창작 등록이 완료되었습니다. 팬아트 ID: ${notice.metadata.fanartId}, 작가 ID: ${notice.metadata.secondWriterId}`
      case 'OVERBID':
        return `NFT ${notice.metadata.nftId}의 입찰가가 ${notice.metadata.previousBiddingPrice} 이상으로 갱신되었습니다.`
      case 'NFT_PURCHASE':
        return `NFT ${notice.metadata.nftId} 구매가 완료되었습니다. 거래가격: ${notice.metadata.tradingValue}`
      case 'NFT_SOLD':
        return `NFT ${notice.metadata.nftId}가 판매 완료되었습니다. 거래가격: ${notice.metadata.tradingValue}, 수익: ${notice.metadata.revenue}`
      case 'SECONDARY_CREATION_NFT_SOLD':
        return `2차 창작 NFT ${notice.metadata.nftId}가 판매 완료되었습니다. 거래가격: ${notice.metadata.tradingValue}, 저작권료: ${notice.metadata.copyrightFee}`
      case 'BLOCKCHAIN_NETWORK_SUCCESS':
        return notice.metadata.message
      case 'BLOCKCHAIN_NETWORK_FAIL':
        return notice.metadata.message
      case 'SECONDARY_CREATION_NFT_MINT':
        return `2차 창작 NFT 발행이 진행되었습니다. 팬아트 ID: ${notice.metadata.fanartId}`
      default:
        return '알림 내용이 없습니다.'
    }
  }

  return (
    <div
      className={`mb-4 rounded-lg bg-black p-4 shadow ${notice.checked === 'N' ? 'border-chaintoon border-l-4' : ''}`}
    >
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-bold'>{getNoticeTitle(notice)}</h3>
      </div>
      <p className='mt-2'>{getNoticeMessage(notice)}</p>
    </div>
  )
}

export default NoticeCard
