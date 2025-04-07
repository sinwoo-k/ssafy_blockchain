import React, { useEffect, useState } from 'react'
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid'
import { Link } from 'react-router-dom'
import BarLoader from 'react-spinners/BarLoader'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'
import { getUserFanarts } from '../../api/fanartAPI'

const fanartDummy = Array(10)
  .fill()
  .map((_, i) => {
    // 100 ~ 400 사이의 랜덤 크기를 예시로 만듭니다.
    const randomWidth = Math.floor(Math.random() * 101) + 200 // 200~300
    const randomHeight = Math.floor(Math.random() * 201) + 200 // 200~400
    return {
      fanartId: i + 1,
      fanartName: `팬아트 ${i + 1}`,
      fanartImage: `https://placehold.co/${randomWidth}x${randomHeight}?text=Fanart+${i + 1}`,
    }
  })

const UserProfileFanart = ({ userId }) => {
  const [isLoading, setIsLoding] = useState(true)
  const [fanarts, setFanarts] = useState([])

  const getData = async () => {
    try {
      const result = await getUserFanarts(userId)
      console.log(result)
      setFanarts(result)
    } catch (error) {
      console.error('팬아트 조회 실패: ', error)
    }
  }

  useEffect(() => {
    // mount
    setFanarts(fanartDummy)
    if (userId) {
      getData()
    }
    // unmount
    return () => {}
  }, [userId])
  return (
    <div className='flex justify-center'>
      <div className='min-h-[500px] w-[1000px] py-10'>
        {fanarts.length === 0 ? (
          <div className='flex h-full w-full flex-col items-center justify-center gap-3'>
            <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
            <p className='text-xl'>등록된 팬아트가 없습니다.</p>
          </div>
        ) : (
          <>
            <MasonryInfiniteGrid
              align='center'
              gap={10}
              column={5}
              onRenderComplete={() => setIsLoding(false)}
            >
              {fanarts.map((fanart) => (
                <div className='item' key={fanart.fanartId}>
                  <Link to={`/fanart/${fanart.fanartId}`}>
                    <img
                      src={fanart.fanartImage}
                      alt='팬아트 이미지'
                      className='w-[190px] rounded-lg'
                    />
                  </Link>
                  <p className='px-2 py-1'>{fanart.fanartName}</p>
                </div>
              ))}
            </MasonryInfiniteGrid>
            {isLoading && (
              <div className='flex h-full items-center justify-center py-10'>
                <BarLoader
                  color='#3cc3ec'
                  width={500}
                  height={5}
                  speedMultiplier={0.5}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default UserProfileFanart
