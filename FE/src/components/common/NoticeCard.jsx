import React from 'react'
import { Link } from 'react-router-dom'
import { deleteNotcie, patchNotice } from '../../api/noticeAPI'
import { useDispatch } from 'react-redux'
import { noticeReducerActions } from '../../redux/reducers/noticeSlice'

// 아이콘
import CloseIcon from '@mui/icons-material/Close'
import IconButton from './IconButton'

const NoticeCard = ({ notice }) => {
  const dispatch = useDispatch()

  // type과 metadata에 따라 상세 메시지를 반환하는 헬퍼 함수
  const getNoticeMessage = (notice) => {
    switch (notice?.type) {
      case 'NTC_SECONDARY_CREATION':
        return `웹툰의 팬아트가 등록되었습니다.`
      case 'NTC_OVERBID':
        return `NFT의 입찰가가 갱신되었습니다.`
      case 'NTC_NFT_PURCHASE':
        return `NFT 구매가 완료되었습니다. 거래가격: ${notice.metadata.tradingValue}`
      case 'NTC_NFT_SOLD':
        return `NFT 판매가 완료되었습니다. 거래가격: ${notice.metadata.tradingValue}, 수익: ${notice.metadata.revenue}`
      case 'NTC_SECONDARY_CREATION_NFT_SOLD':
        return `2차 창작 NFT 판매가 완료되었습니다. 거래가격: ${notice.metadata.tradingValue}, 저작권료: ${notice.metadata.copyrightFee}`
      case 'NTC_BLOCKCHAIN_NETWORK_SUCCESS':
        return notice.metadata.message
      case 'NTC_BLOCKCHAIN_NETWORK_FAIL':
        return notice.metadata.message
      case 'NTC_SECONDARY_CREATION_NFT_MINT':
        return `2차 창작 NFT 발행이 진행되었습니다.`
      default:
        return '알림 내용이 없습니다.'
    }
  }

  const getNoticeURL = (notice) => {
    switch (notice?.type) {
      case 'NTC_SECONDARY_CREATION':
        return `/fanart/${notice.metadata.fanartId}`
      case 'NTC_OVERBID':
        return ``
      case 'NTC_NFT_PURCHASE':
        return ``
      case 'NTC_NFT_SOLD':
        return ``
      case 'NTC_SECONDARY_CREATION_NFT_SOLD':
        return ``
      case 'NTC_BLOCKCHAIN_NETWORK_SUCCESS':
        return `/mypage`
      case 'NTC_BLOCKCHAIN_NETWORK_FAIL':
        return `/mypage`
      case 'NTC_SECONDARY_CREATION_NFT_MINT':
        return `/fanart/${notice.metadata.fanartId}`
      default:
        return '알림 내용이 없습니다.'
    }
  }
  const readData = async () => {
    try {
      const result = await patchNotice(notice.noticeId)
      dispatch(noticeReducerActions.markNoticeRead(notice.noticeId))
    } catch (error) {
      console.error('알림 읽음 처리 실패: ', error)
    }
  }

  const deleteData = async (event) => {
    event.preventDefault()
    if (!confirm('알림을 삭제하시겠습니까?')) {
      return
    }
    try {
      const result = await deleteNotcie(notice.noticeId)
      dispatch(noticeReducerActions.removeNotice(notice.noticeId))
    } catch (error) {
      console.error('알림 삭제 실패: ', error)
    }
  }

  return (
    <Link to={getNoticeURL(notice)} onClick={readData}>
      <div
        className={`mb-4 rounded-lg bg-black p-4 shadow ${notice.checked === 'N' ? 'border-chaintoon border-l-4' : ''}`}
      >
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-bold'>알림이 도착했습니다.</h3>
          <div className='hover:text-red-500' onClick={deleteData}>
            <IconButton Icon={CloseIcon} tooltip={'알림 삭제'} />
          </div>
        </div>
        <p className='mt-2'>{getNoticeMessage(notice)}</p>
      </div>
    </Link>
  )
}

export default NoticeCard
