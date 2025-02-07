import Image from "next/image";
import Login from "./auth/login/page";
import HomePage from "./Home/page";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center">
      
      {/* <Login /> */}
      <HomePage />
    </div>
  );
}
