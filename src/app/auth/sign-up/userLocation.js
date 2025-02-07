import { useEffect, useState } from "react";
import { Country } from "country-state-city";

export default function UserLocation({ register, errors }) {
  let [countries, setCountries] = useState([]);
  let [value, setValue] = useState("Select Country");
  // useEffect(() => {
  //   (async () => {
  //     let apiRes = await fetch("https://restcountries.com/v3.1/all");
  //     let jsonRes = await apiRes.json();
  //     console.log("data", jsonRes);
  //   })();
  // }, []);
  useEffect(() => {
    // Fetching all countries
    setCountries(Country.getAllCountries());
    // console.log(Country.getAllCountries());
  }, []);
  let handleCountryChange = (e) => {
    console.log(e.target.value);
    if (e.target.value != "") {
      setValue(e.target.value);
    } else {
      setValue("");
    }
  };
  return (
    <div className="flex flex-col ">
      {/* <label
        htmlFor="country"
        className="mb-1 text-lg"
        style={{color: "#CBCAD7"}}
      >
        Choose a country:
      </label> */}
      <select
        id="country"
        name="country"
        onChange={handleCountryChange}
        className="select"
        // value={value}
        {...register("country")}
      >
        <option value={""} className="font-medium">
          Select Country
        </option>
        {countries.map((country) => (
          <option key={country.isoCode} value={country.name}>
            {country.name}
          </option>
        ))}
        <option value={"Others"}>Others</option>
      </select>
    </div>
  );
}
