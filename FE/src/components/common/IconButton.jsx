import React, { useState } from 'react'

const IconButton = ({ Icon, tooltip, style }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className='relative'>
      <div className='cursor-pointer'>
        <Icon
          onMouseOver={() => setShowTooltip(true)}
          onMouseOut={() => setShowTooltip(false)}
          sx={style}
        />
      </div>
      {showTooltip && (
        <span
          className='bg-chaintoon absolute top-full left-1/2 mt-2 -translate-x-1/2
            rounded px-2 py-1 text-xs whitespace-nowrap text-black shadow-md'
        >
          {tooltip}
        </span>
      )}
    </div>
  )
}

export default IconButton
