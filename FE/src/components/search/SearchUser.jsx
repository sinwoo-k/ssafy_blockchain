import React from 'react'
import SearchUserCard from './SearchUserCard'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'

const SearchUser = ({ userList }) => {
  return (
    <div className='flex w-[1000px] flex-col gap-3 py-5'>
      <h2 className='text-xl'>유저</h2>
      <div className='flex justify-between'>
        <span>총 {userList.length}건</span>
      </div>
      <div>
        {userList.length === 0 ? (
          <div className='flex w-full flex-col items-center justify-center gap-3'>
            <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
            <p className='text-xl'>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className='grid grid-cols-6 gap-y-10'>
            {userList.map((user) => (
              <SearchUserCard key={`user-${user.userId}`} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchUser
