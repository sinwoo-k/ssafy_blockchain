import React from 'react'

const ProgressBar = ({ progress, message }) => {
  return (
    <div className='flex flex-col items-center'>
      {message && <p>{message}</p>}
      <div className='bg-text/75 h-5 w-[500px] rounded-full'>
        <div
          className='bg-chaintoon flex h-5 items-center justify-center rounded-full'
          style={{ width: `${progress}%` }}
        >
          <span className={`${progress === 0 && 'hidden'} text-sm`}>
            {progress}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
