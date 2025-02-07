import { useForm } from "react-hook-form";
import { useState, useEffect, use } from "react";
import UserMobileNumber from "../phoneNumber";
import UserLocation from "../userLocation";
import LocationSelector from "../dataList";
import { useContext } from "react";
// import { UserContext } from "@/contextApi/providers/User";
import { useUser } from "@/app/context/UserContext";
import { completeProfile } from "@/components/services/profile/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PulseLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

export default function UserDetailsForm({ pageNo, setPageNo }) {
  const {toast} = useToast();
  const router = useRouter();

  const { userId, setUserId } = useUser();
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
  let [companyTypeSelected, setCompanyTypeSelected] = useState("");
  let [companyBusinessSelected, setCompanyBusinessSelected] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });
  const onSubmit = async (data) => {
    const newData = data;
    newData.job_title = data.job_title
    newData.company_type = data.company_type
    newData.company_business = data.company_business
    newData.company_name = data.company_name
    newData.mobile = data.mobile
    newData.address = data.country + data.state + data.city;
    setIsLoading(true);
    try {
      const response = await completeProfile({
        ...newData,
        user_id: userId,
        profile_type: "Individual"
      });

      console.log(response)
      toast({
        title: 'Profile completed successfully',
        description: 'Profile completed successfully',
        variant: "success",
        status: 'success',
        duration: 2000,
        className: "bg-green-200",
      })
      // router.push('/auth/login')
      setPageNo(2)

    } catch (error) {
      if (error.message === "Mobile already exists") {
        toast({
          title: 'Mobile Number already exists',
          description: 'Mobile Number already exists',
          // variant: "warning",
          status: 'warning',
          duration: 2000,
          className: "bg-yellow-200",
        })
      } else {
        toast({
          title: 'Something went wrong. Please try again.',
          description: 'Something went wrong. Please try again.',
          variant: "destructive",
          status: 'error',
          duration: 2000,
        })
      }
    } finally {
      setIsLoading(false);
    }
    console.log("data----->", data);

  };
  console.log("user ID: ", userId);
  // let onClickHandler = () => {
  //   setPageNo(pageNo + 1);
  // };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start justify-start w-full mt-2"
    >
      <label
        className="text-base  font-medium "
        style={{ color: "rgba(38, 32, 59, 1)" }}
        htmlFor="mobile"
      >
        Mobile Number
        <span style={{ color: "rgba(228, 82, 112, 1)" }}> *</span>
      </label>
      <UserMobileNumber register={register} />

      <LocationSelector register={register} />

      <label
        className="text-base  font-medium "
        style={{ color: "rgba(38, 32, 59, 1)" }}
        htmlFor="job_title"
      >
        Job Tile
        <span style={{ color: "rgba(228, 82, 112, 1)" }}> *</span>
      </label>
      <input
        id="job_title"
        name="job_title"
        placeholder="Enter you job title"
        className="border w-full border-slate-400 mb-2 px-2 py-1.5 rounded-md drop-shadow-md"
        // {...register("jobTitle", {
        //   required: "jobTitle is required.",
        // })}
        {...register("job_title")}

      // required
      ></input>
      {/* {errors.companyName && (
        <p style={{ color: "rgba(228, 82, 112, 1)" }}>
          {errors.jobTitle.message}
        </p>
      )} */}
      <label
        className="text-base   font-medium  "
        style={{ color: "rgba(38, 32, 59, 1)" }}
        htmlFor="company_name"
      >
        Organization
        <span style={{ color: "rgba(228, 82, 112, 1)" }}> *</span>
      </label>
      <input
        id="company_name"
        name="company_name"
        placeholder="Curreny Organization"
        className="border w-full border-slate-400 mb-2 px-2 py-1.5 rounded-md drop-shadow-md"
        {...register("company_name")}
      // required
      ></input>
      {/* 
      {errors.areaOfOprations && (
        <p style={{ color: "rgba(228, 82, 112, 1)" }}>
          {errors.organization.message}
        </p>
      )} */}
      <label
        htmlFor="company_type "
        className="text-base font-medium "
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
      <div className="flex justify-center w-full mt-1 ">
        <Button
          type="submit"
          className="flex justify-center items-center sm:w-[50%] p-2 text-white font-medium rounded-md bg-black hover:opacity-90 transition-all ease-in-out duration-300"
          disabled={isLoading}
        // onClick={onClickHandler}
        >
          {isLoading ? <PulseLoader size={4} color="#ffffff" /> : 'Continue'}
        </Button>
      </div>
    </form>
  );
}
