import React, { useState } from 'react'

// 아이콘
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Link } from 'react-router-dom'
import { getRandomColor } from '../../utils/randomColor'

const SearchUserCard = ({ user }) => {
  console.log(user)
  const [randomColor, setRandomColor] = useState(getRandomColor())

  return (
    <Link to={`/user/${user.id}`}>
      <div className='flex w-[150px] flex-col items-center gap-3'>
        {/* 프로필 이미지 */}
        {user.profileImage !== '' ? (
          <div>
            <img
              src={user.profileImage}
              alt='유저 프로필 이미지'
              className='h-[50px] w-[50px] rounded-full object-cover'
            />
          </div>
        ) : (
          <div>
            <AccountCircleIcon sx={{ fontSize: 50, color: randomColor }} />
          </div>
        )}
        {/* 유저 닉네임 */}
        <p>{user.nickname}</p>
      </div>
    </Link>
  )
}

export default SearchUserCard
