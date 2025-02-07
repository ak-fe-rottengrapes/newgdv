import { useEffect, useState } from "react";
import { Country } from "country-state-city";

export default function UserMobileNumber({ register, errors }) {
  let [countries, setCountries] = useState([]);
  let [code, setCode] = useState("+91");
  let [number, setNumber] = useState("");

  useEffect(() => {
    setCountries(Country.getAllCountries());
    // console.log(Country.getAllCountries());
  }, []);
  let handleCodeChange = (e) => {
    console.log(e.target.value);
    if (e.target.value != "") {
      setCode(e.target.value);
    } else {
      setCode("");
    }
  };
  let handleNumberChange = (e) => {
    setNumber(e.target.value);
  };
  return (
    <div className="flex justify-between w-full">
      {/* <select
        id="country_code"
        name="country_code"
        className="select h-[37px] w-1/4 mr-6 border border-slate-400"
        onChange={handleCodeChange}
        {...register("country_code")}
      >
        <option value="">Code</option>
        {countries.map((ele) => (
          <option
            value={ele.phonecode}
            key={ele.isoCode}
          >{`+ ${ele.phonecode}`}</option>
        ))}
      </select> */}
      <select
        id="country_code"
        name="country_code"
        className="select h-[37px] w-1/4 mr-6 border border-slate-400"
        onChange={handleCodeChange}
        {...register("country_code")}
      >
        <option value="">Code</option>
        {countries.map((ele) => (
          <option
            value={`+${ele.phonecode}`}
            key={ele.isoCode}
          >{`+${ele.phonecode}`}</option>
        ))}
      </select>
      <input
        name="mobile"
        id="mobile"
        type="tel"
        onChange={handleNumberChange}
        // value={number}
        placeholder="Enter Mobile Number"
        className="w-3/4 px-2 py-!0 h-[37px] rounded-md border border-slate-400"
        {...register("mobile", {
          required: "Mobile number is required ",
          pattern: {
            value: /^[0-9]{8,15}$/,
            message:
              "Mobile number must be between 8 and 15 digits and contain only numbers",
          },
        })}
      ></input>
    </div>
  );
}







