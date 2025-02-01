'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdEyeOff, IoMdEye } from "react-icons/io";

const Login = () => {
  const [isHide, setIsHide] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setIsHide(!isHide);
  };

  return (
    <div className='relative w-full h-screen'>
      <Image
        src="/loginBG.png"
        alt="Login Background"
        fill
        className="object-cover"
        priority
      />
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        rounded-3xl bg-white z-10 
        w-[95%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] 
        h-auto min-h-[500px] 
        p-4 sm:p-6 md:p-8 lg:p-10 
        flex flex-col items-center'>
        
        <h1 className='text-2xl sm:text-3xl font-bold text-black'>Sign in</h1>
        <p className='mt-2 text-xs sm:text-sm text-gray-500 text-center'>
          New to Geodatavault?
          <span className='text-blue-500 cursor-pointer hover:underline'> Sign up for free</span>
        </p>
        
        <form className='w-full max-w-md flex flex-col gap-4 mt-6 sm:mt-10'>
          <div className='flex flex-col gap-2'>
            <label htmlFor="email" className='text-sm text-gray-500'>Email address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your Email Id"
              className='border text-black border-gray-300 rounded-md p-2 w-full'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="password" className='text-sm text-gray-500'>Password</label>
            <div className='relative'>
              <input 
                type={isHide ? "password" : "text"}
                id="password" 
                placeholder="Enter Password"
                className='border text-black border-gray-300 rounded-md p-2 w-full'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'>
                {isHide ? (
                  <IoMdEye
                    fontSize={"1.5rem"}
                    color="#9794AA"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <IoMdEyeOff
                    fontSize={"1.5rem"}
                    color="#9794AA"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </span>
            </div>
            <div className='flex justify-end'>
              <Link 
                href="/auth/forget-password"
                className='text-orange-500 text-xs sm:text-sm hover:underline'
              >
                Forget password?
              </Link>
            </div>
          </div>

          <button 
            type="submit"
            className='mt-4 w-full bg-gray-800 text-white py-2 sm:py-3 rounded-md 
              hover:bg-black transition-colors duration-300 
              text-lg sm:text-xl font-medium'
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;