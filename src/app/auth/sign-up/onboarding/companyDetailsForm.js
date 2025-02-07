"use client";
import { useState, useEffect, useContext } from "react";
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
// import { UserContext } from "@/contextApi/providers/User";
import { useUser } from "@/app/context/UserContext";
import { completeProfile } from "@/components/services/profile/api";
import { useToast } from "@/hooks/use-toast";
import { PulseLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

export default function CompanyDetailsForm({pageNo, setPageNo}) {
  const {toast} = useToast();
  const router = useRouter()
  let { userId, setUserId } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  let [companyType, setCompanyType] = useState([
    "Sole Proprietorship",
    "Partnership",
    "Limited Liability Company (LLC)",
    "Corporation",
    "Non-Profit Organization",
    "Cooperative",
    "Franchise",
    "Government",
  ]);
  let [business, setBusiness] = useState([
    "Technology",
    "Healthcare",
    "Finance",
    "Retail",
    "Manufacturing",
    "Energy",
    "Education",
    "Real Estate",
    "Transportation",
    "Hospitality",
    "Media and Entertainment",
    "Agriculture",
    "Construction",
    "Food and Beverage",
    "Telecommunications",
  ]);
  let [companyTypeSelected, setCompanyTypeSelected] = useState("");
  let [companyBusinessSelected, setCompanyBusinessSelected] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await completeProfile({
        ...data,
        user_id: userId,
        profile_type: "Organization"
      });
      console.log(response)
      toast({
        title: "Profile created successfully",
        description: "Redirecting to the next page",
        // variant: "success",
        status: "success",
        duration: 2000,
        className: "bg-green-200",
      })
      setPageNo(2);
      // router.push('/auth/login')
    } catch (error) {
      if (error.message === "Mobile already exists") {
        toast({
          title: "Mobile already exists",
          description: "Please try again",
          // variant: "destructive",
          className: "bg-yellow-200",
          status: "error",
          duration: 2000,
        })
      } else {
        toast({
          title: "Error",
          description: "Please try again",
          variant: "destructive",
          status: "error",
          duration: 2000,
        })
      }
    } finally {
      setIsLoading(false);
    }
  }
  
let onCompanyTypeChange = (e) => {
  if (e.target.value) {
    setCompanyTypeSelected(e.target.value);
  } else {
    setCompanyTypeSelected("");
  }
};
let onCompanyBusinessChange = (e) => {
  if (e.target.value) {
    setCompanyBusinessSelected(e.target.value);
  } else {
    setCompanyBusinessSelected("");
  }
};
let onClickHandler = () => {
  setPageNo(pageNo + 1);
};



return (
  <div //className="flex flex-col justify-center items-center  sm:w-[48%] lg:w-[44%] sm:m-1 xl:w-[30%] 2xl:max-w-lg"
    className="flex flex-col justify-center items-center sm:max-w-sm w-full  "
  >
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start justify-start w-full mt-2"
    >
      <label
        className="text-base  font-medium "
        style={{ color: "rgba(38, 32, 59, 1)" }}
        htmlFor="company_name"
      >
        Company Name
        <span style={{ color: "rgba(228, 82, 112, 1)" }}> *</span>
      </label>
      <input
        id="company_name"
        name="company_name"
        placeholder="Enter your company name"
        className="border w-full border-slate-400 mb-2 px-2 py-1.5 rounded-md drop-shadow-md"
        {...register("company_name", {
          required: "Company Name is required.",
        })}

      // required
      ></input>
      {errors.companyName && (
        <p style={{ color: "rgba(228, 82, 112, 1)" }}>
          {errors.companyName.message}
        </p>
      )}
      <label
        className="text-base   font-medium  "
        style={{ color: "rgba(38, 32, 59, 1)" }}
        htmlFor="company_email"
      >
        Email Address
        <span style={{ color: "rgba(228, 82, 112, 1)" }}> *</span>
      </label>
      <input
        id="company_email"
        name="company_email"
        placeholder="Organization Email Address"
        className="border w-full border-slate-400 mb-2 px-2 py-1.5 rounded-md drop-shadow-md"
        {...register("company_email", {
          required: "Company email is required.",
        })}
      // required
      ></input>
      <label
        className="text-base   font-medium  "
        style={{ color: "rgba(38, 32, 59, 1)" }}
        htmlFor="mobile"
      >
        Company Phone Number
      </label>
      <UserMobileNumber register={register} />
      {errors.mobile && (
        <p style={{ color: "rgba(228, 82, 112, 1)" }}>
          {errors.mobile.message}
        </p>
      )}{" "}
      <label
        htmlFor="company_type "
        className="text-base   font-medium "
        style={{ color: "rgba(38, 32, 59, 1)" }}
      >
        Organization Type{" "}
        <span style={{ color: "rgba(228, 82, 112, 1)" }}> *</span>
      </label>
      <select
        id="company_type"
        name="company_type"
        className="border w-full border-slate-400 mb-2 p-2 rounded-md drop-shadow-md"
        {...register("company_type", {
          required: "Organization type is required.",
        })}
        onChange={onCompanyTypeChange}
      // required
      >
        <option value={""}>Select Organization Type</option>

        {companyType.map((ele, idx) => (
          <option value={ele} key={idx}>
            {ele}
          </option>
        ))}
        <option value={"other"}>Others</option>
      </select>
      {errors.OrganizationType && (
        <p style={{ color: "rgba(228, 82, 112, 1)" }}>
          {errors.OrganizationType.message}
        </p>
      )}
      <label
        htmlFor="company_business"
        className="text-base   font-medium "
        style={{ color: "rgba(38, 32, 59, 1)" }}
      >
        Area of Operations{" "}
        <span style={{ color: "rgba(228, 82, 112, 1)" }}> *</span>
      </label>
      <select
        id="company_business"
        name="company_business"
        className="border w-full border-slate-400 mb-2 p-2 rounded-md drop-shadow-md"
        {...register("company_business", {
          required: "Area of operation is required.",
        })}
        onChange={onCompanyBusinessChange}
      // required
      >
        {" "}
        <option value={""}>Area of Operations</option>
        {business.map((ele, idx) => (
          <option value={ele} key={idx}>
            {ele}
          </option>
        ))}
        <option value={"other"}>Others</option>
      </select>
      {errors.areaOfOprations && (
        <p style={{ color: "rgba(228, 82, 112, 1)" }}>
          {errors.areaOfOprations.message}
        </p>
      )}
      <label
        className="text-base  font-medium   "
        style={{ color: "rgba(38, 32, 59, 1)" }}
        htmlFor="address"
      >
        Company Address
        <span style={{ color: "rgba(228, 82, 112, 1)" }}> *</span>
      </label>
      <input
        id="address"
        name="address"
        placeholder="Enter your company name"
        className="border w-full border-slate-400 mb-2 p-2 rounded-md drop-shadow-md"
        {...register("address", {
          required: "Company Address is required.",
        })}
      // required
      ></input>
      {errors.address && (
        <p style={{ color: "rgba(228, 82, 112, 1)" }}>
          {errors.address.message}
        </p>
      )}
      <div className="flex justify-center w-full mt-1 ">
        <Button
          type="submit"
          className="flex justify-center bg-black items-center sm:w-[50%] p-2 text-white font-medium rounded-md  hover:opacity-90 transition-all ease-in-out duration-300"
        // onClick={onClickHandler}
        disabled={isLoading}
        >
          
          {isLoading ? <PulseLoader size={4} color="#ffffff" /> : 'Continue'}
        </Button>
      </div>
    </form>
  </div>
);

}