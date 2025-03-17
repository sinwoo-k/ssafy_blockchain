import React from 'react'
import { RingLoader } from 'react-spinners'

const Loader = () => {
  return (
    <div className='fixed top-0 left-0 z-50 h-[100vh] w-full bg-white/50'>
      <div className='flex h-full w-full items-center justify-center'>
        <RingLoader
          color='#3cc3ec'
          loading={true}
          size={150}
          aria-label='Loading Spinner'
          data-testid='loader'
        />
      </div>
    </div>
  )
}

export default Loader
