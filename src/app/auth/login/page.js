'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from "react-simple-captcha";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

const Login = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isHide, setIsHide] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaValid, setCaptchaValid] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const togglePasswordVisibility = () => {
    setIsHide(!isHide);
  };

  const handleCaptchaValidation = () => {
    const isValid = validateCaptcha(captchaInput);
    setCaptchaValid(isValid);
    if (!isValid) {
      toast({
        title: 'Invalid Captcha',
        description: 'Please enter the correct CAPTCHA',
        variant: "destructive",
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleCaptchaValidation();
    if (!captchaValid) {
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      username: email,
      password,
      redirect: false,
    });

    if (res.error) {
      try {
        const errorData = JSON.parse(res.error);
        if (errorData.error === "Invalid credentials.") {
          toast({
            title: 'Invalid Credentials',
            description: 'Please enter the correct email and password',
            variant: "destructive",
            status: 'error',
            duration: 2000,
          });
        }

        if (errorData.profile_complete === false) {
          toast({
            title: 'Profile Incomplete',
            description: 'Please complete your profile',
            variant: "destructive",
            status: 'error',
            duration: 2000,
          });
          router.push('/auth/sign-up/onboarding');
          setLoading(false);
          return;
        }

        if (errorData.profile_complete === true && errorData.is_active === false) {
          toast({
            title: 'Account Inactive',
            description: 'Please contact the administrator to activate your account',
            variant: "destructive",
            status: 'error',
            duration: 2000,
          });
        }
      } catch (error) {
        console.error("Error parsing error response:", error);
        toast({
          title: 'Authentication failed',
          description: 'Please try again',
          variant: "destructive",
          status: 'error',
          duration: 2000,
        });
      }

      setLoading(false);
      return;
    }

    if (res.status === 200) {
      const session = await getSession();
      toast({
        title: 'Sign In Successful',
        description: 'Redirecting to dashboard...',
        status: 'success',
        className: 'bg-green-200',
        duration: 2000,
      });
      if (session?.user?.is_admin) {
        router.push("/admin");
      } else if (session?.user?.is_employee) {
        router.push("/employee");
      } else {
        router.push("/user/order");
      }
    }

    setLoading(false);
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
        
        <form className='w-full max-w-md flex flex-col gap-4 mt-6 sm:mt-10' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-2'>
            <label htmlFor="email" className='text-sm text-gray-500'>Email address</label>
            <input 
              type="email" 
              id="email" 
              required
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
                required
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

          <div>
            <label
              className="text-left font-normal text-base"
              style={{ color: "rgba(73, 71, 90, 1)" }}
              htmlFor="captcha"
            >Enter Captcha</label>
            <div className="relative w-full">
              <LoadCanvasTemplate />
              <input 
                type="text"
                placeholder="Enter the CAPTCHA"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="mt-2 mb-2 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className='mt-4 w-full bg-gray-800 text-white py-2 sm:py-3 rounded-md 
              hover:bg-black transition-colors duration-300 
              text-lg sm:text-xl font-medium'
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;