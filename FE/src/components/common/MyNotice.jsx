import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import NoticeModal from './NoticeModal'

const MyNotice = () => {
  const [showModal, setShowModal] = useState(false)
  // redux 스토어에서 notice 데이터를 읽음
  const notice = useSelector((state) => state.notice)

  return (
    <div className='relative'>
      {/* 알림 아이콘 클릭 시 모달 오픈 */}
      <div
        className='hover:text-chaintoon cursor-pointer'
        onClick={() => setShowModal(true)}
      >
        <NotificationsNoneIcon sx={{ fontSize: 32 }} />
      </div>
      <div className='bg-chaintoon absolute -top-1 -right-2 flex h-[22px] w-[22px] items-center justify-center rounded-full text-center text-xs text-black'>
        <span className='inline-block translate-y-[0.5px] transform'>
          {notice.uncheckedNoticeCount || 0}
        </span>
      </div>
      {showModal && (
        <NoticeModal
          onClose={() => setShowModal(false)}
          notices={notice.noticeList || []}
        />
      )}
    </div>
  )
}

export default MyNotice
