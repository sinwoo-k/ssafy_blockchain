import React, { useState } from 'react'
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid'
import { Link } from 'react-router-dom'
import BarLoader from 'react-spinners/BarLoader'

// 아이콘
import ErrorIcon from '@mui/icons-material/Error'

const SearchFanart = ({ fanartList }) => {
  const [isLoading, setIsLoding] = useState(true)
  return (
    <div className='flex w-[1000px] flex-col gap-3 py-5'>
      <h2 className='text-xl'>팬아트</h2>
      <div className='flex justify-between'>
        <span>총 {fanartList.length}건</span>
      </div>
      <div>
        {fanartList.length === 0 ? (
          <div className='flex w-full flex-col items-center justify-center gap-3'>
            <ErrorIcon sx={{ fontSize: 75, color: '#f5f5f5' }} />
            <p className='text-xl'>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div>
            <MasonryInfiniteGrid
              align='center'
              gap={10}
              column={5}
              onRenderComplete={() => setIsLoding(false)}
            >
              {fanartList.map((fanart) => (
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
              <div className='flex justify-center py-10'>
                <BarLoader
                  color='#3cc3ec'
                  width={500}
                  height={5}
                  speedMultiplier={0.5}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchFanart
