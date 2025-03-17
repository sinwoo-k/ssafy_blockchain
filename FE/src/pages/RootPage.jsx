import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/common/NavBar'

const RootPage = () => {
  return (
    <div id='root-page' className='w-full'>
      <NavBar />
      <Outlet />
    </div>
  )
}

export default RootPage
