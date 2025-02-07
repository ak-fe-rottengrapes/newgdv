"use client";

import "@/app/styles.css";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import UserMobileNumber from "./phoneNumber";
import { useToast } from "@/hooks/use-toast";
import UserLocation from "./userLocation";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from "react-simple-captcha";
import LocationSelector from "./dataList";
import { SignUpUser } from "@/components/services/profile/api";
import { useContext } from "react";
import { useUser } from "@/app/context/UserContext";
import { PulseLoader } from "react-spinners";
import { Button } from "@/components/ui/button";


export default function SignUp() {
  const {toast} = useToast();
  let [isHide, setIshide] = useState(true);
  let [email, setEmail] = useState(null);
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [isEmailVerified, setIsEmailVerified] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const api_url= process.env.NEXT_PUBLIC_API_URL

  const togglePasswordVisibility = () => {
    setIshide(!isHide);
  };
  let route = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });
  let emailValue = watch("email");
  let passwordValue = watch("password");
  let confirmPasswordValue = watch("confirmPassword");

  const {
    userId,
    setUserId,
  } = useUser();


  // const onSubmit = async (data) => {
  //   try {
      
  //     setIsLoading(true);
  //     const { first_name, last_name, email, password } = data;
  //     const apiData = { first_name, last_name, email, password };

  //     const response = await SignUpUser(apiData);

  //     toast.success("Registration successful!");
  //     setUserId(response.user_id);
  //     route.push("/auth/sign-up/onboarding");

      
  //   } catch (error) {
  //     // toast.error("Registration failed");
  //     const errorMessage = error.response?.data?.error;
  //     toast.error(errorMessage) 
  //     setIsLoading(false);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const { first_name, last_name, email, password } = data;
      const apiData = { first_name, last_name, email, password };
      
      // Attempt to register the user
      const response = await SignUpUser(apiData);
  
      toast({
        title: "Registration successful!",
        description: "Please complete your profile",
        status: "success",
        duration: 2000,
        className: "bg-green-200",
      })
      setUserId(response.user_id);
      route.push("/auth/sign-up/onboarding");
  
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error,
        status: "error",
        duration: 2000,
        className: "bg-red-200",
      })
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    setEmail(emailValue);
  }, [emailValue]);

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleTermAndCondition = () => {
    route.push("/term-and-conditions");

  }

  useEffect(() => {
    setConfirmPassword(confirmPasswordValue);
    setPassword(passwordValue);
  }, [confirmPasswordValue]);

  const handleCaptchaValidation = () => {
    const isValid = validateCaptcha(captchaInput);
    setCaptchaValid(isValid);
    console.log("Api url",api_url)
    if (!isValid) {
      // toast.error("Invalid Captcha");
    }
  }

  return (
    <div className=" flex signUpMainDiv ">
      <div className=" leftSignUpDiv ">
        <div className="h-[80%] p-2 sm:my-5 mx-3 w-full md:w-[70%]">
          <div className="mt-8">
            <h1
              className=" text-xl font-medium sm:text-xl sm:font-normal"
              style={{ color: "#FFFFFF" }}
            >
              Logo
            </h1>
            <h1
              className=" text-xl font-bold sm:text-2xl sm:font-semibold mb-2"
              style={{ color: "#FFFFFF" }}
            >
              Welcome to Geodatavault👋
            </h1>
            <p className=" text-sm mb-4 " style={{ color: "#D9D9D9" }}>
              Kindly fill in your details below to create an account
            </p>
          </div>
          <form
            className="flex flex-col my-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label
              htmlFor="first_name"
              className="mb-1 text-base"
              style={{ color: "#CBCAD7" }}
            >
              First Name*
            </label>
            <input
              placeholder="Enter your first name"
              type="text"
              id="first_name"
              name="first_name"
              // required
              {...register("first_name", {
                required: "Name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/, // Regex to allow only alphabetic characters and spaces
                  message: "Name should contain only alphabetic characters",
                },
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters long",
                },
                maxLength: {
                  value: 30,
                  message: "Name cannot exceed 30 characters",
                },
              })}
            />
            {errors.fullname && (
              <p className="text-red-400 text-sm">{errors.fullname.message}</p>
            )}
            <label
              htmlFor="last_name"
              className="mb-1 text-base"
              style={{ color: "#CBCAD7" }}
            >
              last Name*
            </label>
            <input
              placeholder="Enter your last name"
              type="text"
              id="last_name"
              name="last_name"
              // required
              {...register("last_name", {
                required: "Name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/, // Regex to allow only alphabetic characters and spaces
                  message: "Name should contain only alphabetic characters",
                },
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters long",
                },
                maxLength: {
                  value: 30,
                  message: "Name cannot exceed 30 characters",
                },
              })}
            />
            {errors.fullname && (
              <p className="text-red-400 text-sm">{errors.fullname.message}</p>
            )}

            <label
              htmlFor="email"
              className="mb-1 text-base"
              style={{ color: "#CBCAD7" }}
            >
              Email Address*
            </label>
            <div className="relative w-full">
              <input
                id="email"
                name="email"
                placeholder="Enter your email address"
                type="email"
                className="w-full"
                // required
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              ></input>
              {/* {email && (
                <button
                  disabled={email.length ? false : true}
                  type="button"
                  className="bg-green-700 w-fit py-1 px-3 text-white rounded font-medium hover:bg-green-800 absolute right-1 top-1.5 "
                  onClick={() => {
                    console.log("verify emailś");
                    setIsEmailVerified(true);
                  }}
                >
                  Verify
                </button>
              )} */}
            </div>

            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}

            <label className="mb-1 text-base" style={{ color: "#CBCAD7" }}>
              Password*
            </label>
            <div className="relative w-full">
              <input
                id="password"
                name="password"
                placeholder="Enter your full password"
                className="w-full"
                type={isHide ? "password" : "text"}
                // disabled={isEmailVerified ? false : true}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  validate: {
                    containsLetter: (value) =>
                      /[A-Za-z]/.test(value) || "Password must contain letters",
                    containsNumber: (value) =>
                      /[0-9]/.test(value) || "Password must contain numbers",
                    containsSpecialChar: (value) =>
                      /[!@#$%^&*]/.test(value) ||
                      "Password must contain special characters",
                    notContainEmail: (value) =>
                      !email ||
                      !value.includes(email) ||
                      "Password should not contain the email",
                  },
                })}
              />
              <span className="absolute top-2.5 right-2">
                {isHide ? (
                  <span className="flex flex-row items-center">
                    <IoMdEye
                      fontSize={"1.5rem"}
                      color="#CBCAD7"
                      onClick={togglePasswordVisibility}
                    />
                  </span>
                ) : (
                  <span className="flex flex-row items-center">
                    <IoMdEyeOff
                      fontSize={"1.5rem"}
                      color="#9794AA"
                      onClick={togglePasswordVisibility}
                    />
                  </span>
                )}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password.message}</p>
            )}
            {errors.password?.types?.containsLetter && (
              <p className="text-red-400 text-sm">
                {errors.password.types.containsLetter}
              </p>
            )}
            {errors.password?.types?.containsNumber && (
              <p className="text-red-400 text-sm">
                {errors.password.types.containsNumber}
              </p>
            )}
            {errors.password?.types?.containsSpecialChar && (
              <p className="text-red-400 text-sm">
                {errors.password.types.containsSpecialChar}
              </p>
            )}
            {errors.password?.types?.notContainEmail && (
              <p className="text-red-400 text-sm">
                {errors.password.types.notContainEmail}
              </p>
            )}

            <label className="mb-1 text-base" style={{ color: "#CBCAD7" }}>
              Confirm Password*
            </label>
            <div className="relative w-full">
              <input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Enter your full password"
                className="w-full"
                type={isHide ? "password" : "text"}
              // disabled={isEmailVerified ? false : true}
              // {...register("confirmPassword", {
              //   required: "Password is required",
              //   minLength: {
              //     value: 8,
              //     message: "Password must be at least 8 characters long",
              //   },
              //   validate: {
              //     containsLetter: (value) =>
              //       /[A-Za-z]/.test(value) || "Password must contain letters",
              //     containsNumber: (value) =>
              //       /[0-9]/.test(value) || "Password must contain numbers",
              //     containsSpecialChar: (value) =>
              //       /[!@#$%^&*]/.test(value) ||
              //       "Password must contain special characters",
              //     notContainEmail: (value) =>
              //       !email ||
              //       !value.includes(email) ||
              //       "Password should not contain the email",
              //   },
              // })}
              />

            </div>
            {password != confirmPassword && (
              <p className="text-red-500">
                Password and Confirm Password are not matching.
              </p>
            )}


            <label
              htmlFor="captcha"
              className="mb-1 text-base"
              style={{ color: "#CBCAD7" }}
            >
              Enter Captcha
            </label>
            <div className="relative w-full">
              <LoadCanvasTemplate />
              <input
                type="tex"
                placeholder="Enter the CAPTCHA"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="mt-2 mb-2 p-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={handleCaptchaValidation}
                className="bg-black hover:opacity-90 ml-2 text-white px-4 py-1 rounded"
              >
                Verify CAPTCHA
              </button>
            </div>
            {!captchaValid && captchaInput && (
              <p className="text-red-400 text-sm">Invalid CAPTCHA</p>
            )}


            <div className="flex flex-row items-center mt-2">
              <input
                id="termsAndCondition"
                name="termsAndCondition"
                type="checkbox"
                className="mr-3 h-4 w-4 checked:bg-customDarkGray checked:text-white"
                // disabled={isEmailVerified ? false : true}
                required
              // {...register("termsAndCondition", {
              //   checked: "Please accept Term's & Conditions.",
              // })}
              ></input>
              <label
                htmlFor="termsAndCondition"
                className="mb-1 text-base cursor-pointer hover:underline"
                style={{ color: "#CBCAD7" }}
                onClick={handleTermAndCondition}
              >
                I agree to terms & conditions.
              </label>
            </div>
            {errors.termsAndCondition && (
              <p className="text-red-400 text-sm">
                {errors.termsAndCondition.message}
              </p>
            )}

            <Button
              className="flex bg-black hover:opacity-90 text-white justify-center items-center p-2 my-4 rounded-md  hover:bg-black  transition-all ease-in-out duration-300"
              // disabled={isEmailVerified ? false : true}
              type="submit"
            // onClick={() => {
            //   route.push("/user");
            // }}
            >
              
          {isLoading ? <PulseLoader size={4} color="#ffffff" /> : 'Register account'}
            </Button>

            <div
              className="text-base mt-3"
              style={{
                color: "rgba(255, 255, 255, 1)",
              }}
            >
              Already have ans account?{" "}
              <Link href={"/auth/login"} className="underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className=" z-10 rounded-l-xl rightSignUpDiv"></div>
    </div>
  );
}
