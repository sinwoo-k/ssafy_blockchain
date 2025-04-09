import React, { useEffect, useState } from 'react'
import UserProfileInfo from '../../components/user/UserProfileInfo'
import UserProfileWebtoon from '../../components/user/UserProfileWebtoon'
import UserProfileFanart from '../../components/user/UserProfileFanart'
import userService from '../../api/userApi'
import { useNavigate, useParams } from 'react-router-dom'

const UserProfile = () => {
  const params = useParams()
  const navigate = useNavigate()

  const [userData, setUserData] = useState({})
  const [active, setActive] = useState('webtoon')

  const getData = async () => {
    try {
      const result = await userService.getUserInfo(params.userId)
      setUserData(result)
    } catch (error) {
      navigate('/error', { state: { message: error.response.data.message } })
      console.error('유저 정보 조회 실패: ', error)
    }
  }

  useEffect(() => {
    getData()
  }, [params.userId])
  return (
    <div className='py-[60px]'>
      <UserProfileInfo user={userData} patchData={getData} />
      <div className='flex justify-center py-5'>
        <div className='flex w-[1000px] border-b'>
          <button
            className={`${active === 'webtoon' && 'bg-chaintoon text-black'}
              w-[150px] cursor-pointer py-2`}
            onClick={() => setActive('webtoon')}
          >
            웹툰
          </button>
          <button
            className={`${active === 'fanart' && 'bg-chaintoon text-black'}
              w-[150px] cursor-pointer py-2`}
            onClick={() => setActive('fanart')}
          >
            팬아트
          </button>
        </div>
      </div>
      {active === 'webtoon' && <UserProfileWebtoon userId={userData.id} />}
      {active === 'fanart' && <UserProfileFanart userId={userData.id} />}
    </div>
  )
}

export default UserProfile
