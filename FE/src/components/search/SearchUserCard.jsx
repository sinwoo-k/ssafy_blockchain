import React from 'react'

// 아이콘
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Link } from 'react-router-dom'

const SearchUserCard = ({ user }) => {
  return (
    <Link to={`/user/${user.userId}`}>
      <div className='flex w-[150px] flex-col items-center gap-3'>
        {/* 프로필 이미지 */}
        {user.profileImage !== null ? (
          <div>
            <img
              src={user.profileImage}
              alt='유저 프로필 이미지'
              className='h-[50px] w-[50px] rounded-full object-cover'
            />
          </div>
        ) : (
          <div>
            <AccountCircleIcon sx={{ fontSize: 50 }} />
          </div>
        )}
        {/* 유저 닉네임 */}
        <p>{user.nickName}</p>
      </div>
    </Link>
  )
}

export default SearchUserCard
