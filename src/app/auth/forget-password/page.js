"use client"
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { forgetPassword } from "@/components/services/profile/api";
import { useToast } from "@/hooks/use-toast";
import { PulseLoader } from "react-spinners";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Forget_password() {
  const router = useRouter(); 
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await forgetPassword({ email: data.email });
      console.log(response);
      toast({
        title: "Success",
        description: 'Check your email for password reset link',
        status: "success",
        className: 'bg-green-200',
        duration: 2000,
      })
      router.push('/auth/login');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        variant: "destructive",
        duration: 2000,
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#1f2937] font-poppins">
      <Image
        src="/loginBG.png"
        alt="Login Background"
        layout="fill"
        className="object-cover z-0"
        priority
      />
      <form
        className="relative z-10 sm:max-w-md w-full rounded-3xl flex flex-col justify-center bg-white py-8 px-8 mx-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-semibold text-center text-black mb-4">
          Forgot Password
        </h1>
        <div className="py-2">
          <label
            className="text-left font-normal text-base text-gray-800"
            htmlFor="email"
          >
            Email address
          </label>
          <input 
            id="email"
            name="email"
            placeholder="Enter your Email Id"
            type="email"
            className="border w-full border-gray-800 rounded-md p-2 mt-1 text-white placeholder-gray-400"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              }
            })}
          />
          {errors.email && (
            <p className="text-red-600">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          className='mt-4 w-full bg-gray-800 text-white py-2 sm:py-3 rounded-md 
              hover:bg-black transition-colors duration-300 
              text-lg sm:text-xl font-medium'
        >
          {loading ? (
            <PulseLoader size={8} color="#ffffff" />
          ) : (
            <p className="text-xl font-medium text-white">
              Submit
            </p>
          )}
        </button>
      </form>
    </div>
  );
}
