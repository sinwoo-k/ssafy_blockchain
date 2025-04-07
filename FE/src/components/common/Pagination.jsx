import React from 'react'

// 아이콘
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const groupSize = 10
  // 현재 페이지가 속한 그룹 계산
  const currentGroup = Math.floor((currentPage - 1) / groupSize)
  const startPage = currentGroup * groupSize + 1
  const endPage = Math.min(startPage + groupSize - 1, totalPages)

  // 그룹 내 페이지 번호 배열 생성
  const pageNumbers = []
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className='mt-4 flex items-center justify-center gap-3'>
      <button
        className={`${startPage === 1 ? 'text-text/50' : 'cursor-pointer'}`}
        onClick={() => onPageChange(startPage - 1)}
      >
        <NavigateBeforeIcon />
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`cursor-pointer ${page === currentPage && ' text-chaintoon text-xl'}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className={`${endPage >= totalPages ? `text-text/50` : 'cursor-pointer'}`}
        onClick={() => onPageChange(endPage + 1)}
      >
        <NavigateNextIcon />
      </button>
    </div>
  )
}

export default Pagination
