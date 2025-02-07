"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "@/app/styles.css";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { LuChevronRight } from "react-icons/lu";
import { IoChevronForwardOutline } from "react-icons/io5";
import UserMobileNumber from "../phoneNumber";
import UserLocation from "../userLocation";

import UserDetailsForm from "./userDetailsForm";
import UserLogoUpload from "./userLogoInput";
import OnBoadringPage2 from "./onboardingPage2";
import CompanyDetailsForm from "./companyDetailsForm";
import ThanksPage from "./thanksPage";

export default function OnBoadring() {
  let router = useRouter();
  let [pageNo, setPageNo] = useState(1);
  let [userType, setUserType] = useState("individual");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });
  const onSubmit = async (data) => {
    console.log("data----->", data);
  };

  let handleBackClick = () => {
    console.log("Button clicked");
    if (pageNo === 1) {
      console.log("Button clicked");
      router.push("/auth/sign-up");
    }
    setPageNo(pageNo - 1);
  };
  let handleSkipClick = () => {
    setPageNo(pageNo + 1);
  };

  return (
    <div className="mainOnBoardingDiv h-screen w-screen p-6 font-poppins  flex justify-center">
      {pageNo === 3 && <ThanksPage />}
      {pageNo == 1 ? (
        <div className="bg-white text-customDarkGray rounded-2xl h-full w-[100%] md:w-[80%] lg:w-[70%]  p-5 relative overflow-y-scroll no-scrollbar">
          <button
            className="flex items-center font-medium absolute left-2"
            onClick={handleBackClick}
            // disabled={pageNo == 1}
          >
            <IoChevronBack /> {" Back"}
          </button>
          {/* <button
            className="flex items-center font-medium absolute  text-customDarkGray right-5"
            onClick={handleSkipClick}
            // disabled={pageNo == 1}
          >
            {"Skip"} <IoChevronForwardOutline />
          </button> */}
          <div className="flex flex-col justify-center items-center h-fit overflow-y-scroll no-scrollbar  ">
            <p className="text-sm " style={{ color: "rgba(156, 154, 165, 1)" }}>
              {pageNo}/2
            </p>
            <h1
              //className="text-xl font-medium sm:text-2xl sm:font-medium text-center md:text-3xl lg:text-3xl  lg:font-medium xl:text-3xl xl:font-medium   2xl:text-4xl"
              className="text-3xl font-medium my-2"
              style={{ color: "rgba(38, 32, 59, 1)" }}
            >
              {pageNo === 1
                ? "Complete your Profile"
                : pageNo === 2 && userType === "organization"
                ? "Set up your Organization logo"
                : "Set up your Profile Picture"}
            </h1>

            <div
              className={`flex justify-center items-center w-full ${
                pageNo == 1 ? "block" : "hidden"
              }`}
            >
              <label htmlFor="Organization" className="mx-2">
                {" "}
                <input
                  type="radio"
                  id="Organization"
                  name="user_type"
                  value={"organization"}
                  className={`mr-1 !bg-customDarkGray`}
                  onClick={() => {
                    setUserType("organization");
                  }}
                ></input>
                Organization
              </label>

              <label htmlFor="individual" className="mx-2">
                {" "}
                <input
                  type="radio"
                  id="individual"
                  name="user_type"
                  value={"individual"}
                  className={`mr-1`}
                  onClick={() => {
                    setUserType("individual");
                  }}
                  defaultChecked
                ></input>
                Individual
              </label>
            </div>
            {pageNo === 1 && userType === "organization" ? (
              <CompanyDetailsForm pageNo={pageNo} setPageNo={setPageNo}/>
            ) : pageNo === 1 && userType === "individual" ? (
              <div //className="flex flex-col justify-center items-center  sm:w-[48%] lg:w-[44%] sm:m-1 xl:w-[30%] 2xl:max-w-lg"
                className="flex flex-col justify-center items-center sm:max-w-sm w-full  "
              >
                <UserDetailsForm pageNo={pageNo} setPageNo={setPageNo} />
              </div>
            ) : null}
          </div>
        </div>
      ) : pageNo == 2 ? (
        <div className="bg-white text-customDarkGray rounded-2xl h-full w-[100%] md:w-[80%] lg:w-[70%]  p-5 relative overflow-y-scroll no-scrollbar">
          <button
            className="flex items-center font-medium absolute left-2"
            onClick={handleBackClick}
            // disabled={pageNo == 1}
          >
            <IoChevronBack /> {" Back"}
          </button>
          <button
            className="flex items-center font-medium absolute  text-customDarkGray right-5"
            onClick={handleSkipClick}
            // disabled={pageNo == 1}
          >
            {/* {"Skip"} <IoChevronForwardOutline /> */}
          </button>
          <div className="h-full flex flex-col justify-center items-center">
            <p
              className="text-sm w-full text-center"
              style={{ color: "rgba(156, 154, 165, 1)" }}
            >
              {pageNo}/2
            </p>
            <h1
              //className="text-xl font-medium sm:text-2xl sm:font-medium text-center md:text-3xl lg:text-3xl  lg:font-medium xl:text-3xl xl:font-medium   2xl:text-4xl"
              className="text-3xl font-medium my-2 w-full text-center"
              style={{ color: "rgba(38, 32, 59, 1)" }}
            >
              {pageNo === 1
                ? "Customize your Profile"
                : pageNo === 2 }
            </h1>
            {pageNo === 2 && userType === "organization" ? (
              // <OnBoadringPage2 pageNo={pageNo} setPageNo={setPageNo} />
              <ThanksPage pageNo={pageNo} setPageNo={setPageNo} />
            ) : pageNo === 2 && userType === "individual" ? (
              <ThanksPage pageNo={pageNo} setPageNo={setPageNo} />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
