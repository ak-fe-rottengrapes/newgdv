'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Logo from '../images/Logo.png';
import { CiMenuBurger } from "react-icons/ci";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

function NavBar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleOrderNow = () => {
    if (status === "authenticated" && session?.user) {
      setIsLoading(true)
      if (session.user.is_admin) {
        router.push("/admin");
      } else if(session.user.is_employee){
        router.push("/empoloyee");
      } else {
        router.push("/user");
      }
    } else {
      router.push("/auth/login")
      setIsLoading(false)
    }
  }






  return (
    <div className='flex justify-between items-center pt-[40px] px-5 shadow-md pb-3'>

      <div className='md:hidden'>
        <button onClick={toggleMenu} className='text-[#FF000A] font-bold'>
          <CiMenuBurger className='text-2xl' />
        </button>
      </div>
      <div className=' justify-center hidden md:block'>
        <Image
          src={Logo}
          width={190}
          height={47}
          alt='Logo'
        />
      </div>
      <div className='flex flex-1 justify-center md:hidden'>
        <Image
          src={Logo}
          width={190}
          height={47}
          alt='Logo'
        />
      </div>

      <div className='hidden md:flex gap-7 font-bold'>
        <a href='#'>Home</a>
        <a href='#'>Discover</a>
        <a href='#'>Products</a>
        <a href='#'>Services</a>
      </div>

      <div className='hidden md:block shadow-sm shadow-gray-800 bg-[#FF000A] rounded-md p-2 text-white font-bold px-5 hover:bg-[#ee3636]'>

        <button onClick={handleOrderNow}>
          {isLoading ? (
            <div className='w-full flex justify-center'>
              <Spinner size="sm" color="white" />
            </div>
          ) : (
            "Order Now"
          )}
        </button>
      </div>

      <div className='md:hidden  shadow-black flex items-center ml-auto'>
        <Button onClick={handleOrderNow} className='shadow-sm shadow-gray-800 block px-4 py-2 font-bold text-center text-white bg-[#FF000A] rounded-md hover:bg-[#ee3636]'>
        {isLoading ? <PulseLoader size={4} color="#ffffff" /> : 'Order'}
        </Button>
      </div>

      {isMenuOpen && (
        <div className='absolute left-3 top-[80px] bg-white shadow-md rounded-md z-10 md:hidden'>
          <a href='#' className='block px-4 py-2 font-bold hover:bg-gray-200'>Home</a>
          <a href='#' className='block px-4 py-2 font-bold hover:bg-gray-200'>Discover</a>
          <a href='#' className='block px-4 py-2 font-bold hover:bg-gray-200'>Products</a>
          <a href='#' className='block px-4 py-2 font-bold hover:bg-gray-200'>Services</a>
        </div>
      )}
    </div>
  );
}

export default NavBar;
