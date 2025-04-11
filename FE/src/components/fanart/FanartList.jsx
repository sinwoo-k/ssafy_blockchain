import React, { useEffect, useState } from 'react'
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid'
import { Link, useNavigate } from 'react-router-dom'
import BarLoader from 'react-spinners/BarLoader'
import { getWebtoonFanarts } from '../../api/fanartAPI'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'

const FanartList = ({ webtoonId }) => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [fanarts, setFanarts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const getData = async (page) => {
    try {
      setIsLoading(true)
      const result = await getWebtoonFanarts(webtoonId, page)
      setFanarts((prev) => [...prev, ...result]) // 기존 데이터에 누적
      setIsLoading(false)
      if (result.length < 30) setHasMore(false)
    } catch (error) {
      navigate('/error', {
        state: {
          message: error.response?.data?.message || '에러가 발생했습니다.',
        },
      })
      console.error('팬아트 조회 실패: ', error)
    }
  }

  useEffect(() => {
    setPage(1)
    getData(1) // 첫 페이지 로딩
  }, [])

  return (
    <div className='flex justify-center'>
      <div className='w-[1000px]'>
        <div className='mb-3 flex justify-between'>
          <p>총 {fanarts?.length}개</p>
        </div>
        {fanarts.length === 0 && !isLoading ? (
          <div className='flex h-[200px] w-full flex-col items-center justify-center gap-3'>
            <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
            <p className='text-xl'>등록된 팬아트가 없습니다.</p>
          </div>
        ) : (
          <>
            <MasonryInfiniteGrid
              align='center'
              gap={10}
              column={5}
              onRenderComplete={() => setIsLoading(false)}
              useFirstRender={true}
              onRequestAppend={(event) => {
                const nextPage = page + 1
                if (!isLoading && hasMore) {
                  setPage(nextPage)
                  getData(nextPage)
                }
              }}
            >
              {fanarts.map((fanart) => (
                <div className='item w-[190px]' key={fanart.fanartId}>
                  <Link to={`/fanart/${fanart.fanartId}`}>
                    <img
                      src={fanart.fanartImage}
                      alt='팬아트 이미지'
                      className='w-[190px] rounded-lg transition-transform duration-150 ease-in-out hover:scale-105'
                    />
                  </Link>
                  <p className='truncate py-1'>{fanart.fanartName}</p>
                </div>
              ))}
            </MasonryInfiniteGrid>
            {isLoading && (
              <div className='flex justify-center py-10'>
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

export default FanartList
