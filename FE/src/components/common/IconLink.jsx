import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const IconLink = ({ path, Icon, tooltip, style }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className='relative'>
      <Link
        to={path}
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
      >
        <Icon sx={style} />
      </Link>
      {showTooltip && (
        <span
          className='bg-chaintoon absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded
          px-2 py-1 text-xs whitespace-nowrap text-black shadow-md'
        >
          {tooltip}
        </span>
      )}
    </div>
  )
}

export default IconLink
