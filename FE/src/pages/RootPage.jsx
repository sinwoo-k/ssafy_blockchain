import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/common/NavBar'
import ScrollToTop from '../components/common/ScrollToTop'

const RootPage = () => {
  return (
    <div id='root-page' className='w-full'>
      <ScrollToTop />
      <NavBar />
      <Outlet />
    </div>
  )
}

export default RootPage
