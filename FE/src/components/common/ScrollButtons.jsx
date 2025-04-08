import React from 'react'

// 아이콘
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const ScrollButtons = ({ entry }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    if (entry && entry.target) {
      const viewerBottom = entry.target.offsetTop + entry.target.clientHeight
      window.scrollTo({ top: viewerBottom, behavior: 'smooth' })
    }
  }

  return (
    <div className='fixed right-16 bottom-8 flex flex-col gap-3'>
      <button
        className='hover:text-chaintoon cursor-pointer rounded-full border bg-black'
        onClick={scrollToTop}
      >
        <ExpandLessIcon sx={{ fontSize: 45 }} />
      </button>
      <button
        className='hover:text-chaintoon cursor-pointer rounded-full border bg-black'
        onClick={scrollToBottom}
      >
        <ExpandMoreIcon sx={{ fontSize: 45 }} />
      </button>
    </div>
  )
}

export default ScrollButtons
