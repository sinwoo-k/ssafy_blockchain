import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/common/NavBar'

const RootPage = () => {
  return (
    <div className='root-page relative min-h-[100vh] w-full bg-black'>
      <NavBar />
      <Outlet />
    </div>
  )
}

export default RootPage
