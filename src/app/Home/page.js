import React from 'react'
import NavBar from './navbar/page'
import Main from './main/page'
import Footer from './footer/page'

function HomePage() {
  return (
    <div className='h-screen p-2'>
      <NavBar />
      <Main />
      <Footer />
    </div>
  )
}

export default HomePage