"use client"
import React from "react";
import { useState, useEffect } from "react";
import { Spinner } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { forgetPassword } from "@/app/user/services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Forget_password() {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onSubmit",
  });
  

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await forgetPassword({ email: data.email });
      console.log(response);
      toast.success("Password reset email sent successfully.");
    } catch (error) {
      toast.error(error.message || "Unable to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center  Login-div font-poppins">
      <form
        className="sm:max-w-md  w-full rounded-3xl flex flex-col  justify-center bg-white py-8  px-8  font-poppins mx-4 loginForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1
            className=" text-2xl font-semibold text-center"
            style={{ color: "rgba(49, 48, 57, 1)" }}
          >
            Forgot Password
          </h1>
        <div className="py-2">
          <label
            className="text-left font-normal text-base"
            style={{ color: "rgba(73, 71, 90, 1)" }}
            htmlFor="email"
          >
            Email address
          </label>
          <input 
            id="email"
            name="email"
            placeholder="Enter your Email Id"
            type="email"
            className="border w-full border-slate-400 rounded-md p-2 mt-1"
            onChange={(e) => setEmail(e.target.value)}
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
          className="flex w-full justify-center p-2 rounded-md my-2 bg-customDarkGray sign-in  border-transparent hover:bg-black transition-all ease-in-out duration-300 "
        >
          {loading ? (
            <Spinner size="md" color="white" />
          ) : (
            <p style={{ color: "#FFFFFF" }} className="text-xl font-medium">
              Submit
            </p>
          )}
        </button>
      </form>
    </div>
  );
}
