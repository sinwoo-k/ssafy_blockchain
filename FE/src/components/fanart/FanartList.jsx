import React, { useState } from 'react'
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid'
import { Link } from 'react-router-dom'
import BarLoader from 'react-spinners/BarLoader'

const FanartList = ({ fanarts }) => {
  const [isLoading, setIsLoding] = useState(true)
  return (
    <div className='flex justify-center'>
      <div className='w-[1000px]'>
        <div className='mb-3 flex justify-between'>
          <p>총 {fanarts?.length}개</p>
          <div className='flex gap-2'>
            <button className='hover:text-chaintoon cursor-pointer'>
              최신순
            </button>
            <button className='hover:text-chaintoon cursor-pointer'>
              오래된 순
            </button>
          </div>
        </div>
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
    </div>
  )
}

export default FanartList
