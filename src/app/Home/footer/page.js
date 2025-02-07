import React from 'react'
import Image from 'next/image'
import Logo from '../images/Logo.png'

function Footer() {
  return (
      <div className='flex flex-wrap  w-full justify-around'>
        <div className='flex flex-col mx-4 gap-3 p-2'>
          <Image
            src={Logo}
            width={190}
            height={47}
            alt='logo'
          />
          <div className='flex flex-col gap-5 p-2 font-semibold'>
            <p>1006, Kanchenjunga Building, 18, Barakhamba Road, New Delhi - 110001, India</p>
            <p>CP 2154, Sector 16A, Vasundhara, Ghaziabad-201012, Uttar Pradesh, India</p>
            <div className='flex gap-1 '>
              <a href='tel:+917838410007' className='hover:underline' >+91-7838410007</a>
              <a href='tel:+919718265000' className='hover:underline'>+91-9718265000</a>
            </div>
            <a href='mailto: info@satpalda.com' className='hover:underline'>info@satpalda.com</a>
          </div>
        </div>
        <div className='flex flex-col gap-2 p-2 font-semibold'>
          <span className='pb-3'>Sectors</span>
          <a href='#' className='hover:underline'>Land & Infrastructure</a>
          <a href='#' className='hover:underline'>Defense & Security</a>
          <a href='#' className='hover:underline'>Agriculture</a>
          <a href='#' className='hover:underline'>Environment</a>
          <a href='#' className='hover:underline'>Energy</a>
          <a href='#' className='hover:underline'>Water & Irrigation</a>
        </div>
        <div className='flex flex-col gap-2 p-2 font-semibold'>
          <span className='pb-3'>Explore</span>
          <a href='#' className='hover:underline'>Home</a>
          <a href='#' className='hover:underline'>About Us</a>
          <a href='#' className='hover:underline'>Blog</a>
          <a href='#' className='hover:underline'>Event & News</a>
          <a href='#' className='hover:underline'>Career</a>
          <a href='#' className='hover:underline'>Contact Us</a>
        </div>
        <div className='flex flex-col gap-3 p-2 font-semibold'>
          <div className='flex gap-3'>
            <span>Privacy policy</span>
            <span>Terms & Agreements</span>
          </div>
          <p className='text-center text-xl font-bold'>To Stay Updated</p>
        </div>
      </div>
  )
}

export default Footer