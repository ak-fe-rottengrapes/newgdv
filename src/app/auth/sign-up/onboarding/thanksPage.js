// import tick from "../../../../../assets/tick.png";
import tick from '../../../../../public/assets/sign-up/tick.png';
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ThanksPage() {
  let route = useRouter();

  let onClickHandler = () => {
    route.push("/");
  };
  return (
    <div className="bg-white rounded-2xl h-[100%] flex justify-center w-[100%] md:w-[80%] lg:w-[70%] p-5">
      <div className="flex flex-col justify-center items-center h-[100%] sm:w-[70%] lg:w-[60%]">
        <Image
          src={tick}
          className="my-5 h-[8.5rem] w-[8.5rem]"
          alt="Blue Tick image"
        />
        <h1
          className="text-2xl font-medium text-center lg:text-3xl lg:font-bold my-3"
          style={{ color: "rgba(38, 32, 59, 1)" }}
        >
          Account created successfully!
        </h1>
        {/* <p
          style={{ color: "rgba(156, 154, 165, 1) " }}
          className="text-base sm:text-2xl text-center"
        >
          Welcome aboard! Start your success journey with Geodatavault!
        </p> */}
        <p style={{ color: "rgba(156, 154, 165, 1) " }} 
        className="text-base sm:text-xl text-center">We’re reviewing your account for verification. You’ll be notified as soon as it’s verified, and you’ll gain full access to our services. Thank you for your patience!</p>

        <div className="flex justify-center w-full mt-14 ">
          <button
            type="submit"
            className="flex justify-center items-center sm:w-[13rem] p-2 text-white font-bold rounded-md transition duration-300 ease-in-out"
            style={{ background: "rgba(70, 95, 241, 1)" }}
            onClick={onClickHandler}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
