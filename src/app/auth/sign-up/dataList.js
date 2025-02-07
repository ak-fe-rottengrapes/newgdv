// components/LocationSelector.js
import { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";

const LocationSelector = ({ register, errors }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [location, setLocation] = useState({
    country: "",
    state: "",
    city: "",
  });

  const [stateName, setStateName] = useState("");
  const [countryName, setCountryName] = useState("");

  useEffect(() => {
    // Fetching all countries
    setCountries(Country.getAllCountries());
    // console.log(Country.getAllCountries());
  }, []);

  const handleCountryChange = (event) => {
    const countryCode = event.target.value.split("-")[0];
    console.log(countryCode);
    const countryName = event.target.value;
    setSelectedCountry(countryCode);

    setCountryName(
      event.target.value.split("-")[1]?.length
        ? event.target.value.split("-")[1]
        : event.target.value
    );
    setStateName("");
    console.log(
      "Country name",

      event.target.value.split("-")[1]?.length
        ? event.target.value.split("-")[1]
        : event.target.value
      // Country.getCountryByCode(countryCode).name
    );
    setStates(State.getStatesOfCountry(countryCode));
    console.log(State.getStatesOfCountry(countryCode));
    setCities([]); // Reset cities
    setSelectedState(""); // Reset selected state
    setSelectedCity(""); // Reset selected city
    if (countryName === "other") {
      setStateName("Others");
      setSelectedCity("Other");
    }
  };

  const handleStateChange = (event) => {
    const stateCode = event.target.value.split("-")[0];
    setSelectedState(stateCode);
    setCities(City.getCitiesOfState(selectedCountry, stateCode));
    console.log(
      "State name",
      event.target.value,
      // State.getStateByCode(stateCode).name
      event.target.value.split("-")[1]?.length
        ? event.target.value.split("-")[1]
        : event.target.value
    );
    setStateName(
      event.target.value.split("-")[1]?.length
        ? event.target.value.split("-")[1]
        : event.target.value
    );
    setSelectedCity(""); // Reset selected city
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  let getListOfOptions = () => {};

  return (
    <div className="flex flex-col w-full mb-2">
      <label
        htmlFor="country"
        className="mb-1 text-base"
        style={{ color: "rgba(38, 32, 59, 1)" }}
      >
        Country<span style={{ color: "rgba(228, 82, 112, 1)" }}> *</span>
      </label>
      <input
        list="countries"
        id="country"
        name="country"
        className="border border-slate-400 py-1.5 px-2 rounded-md"
        {...register("country")}
        onChange={handleCountryChange}
        placeholder="Enter your country"
      />
      <datalist id="countries">
        {countries.map((country) => (
          <option
            key={country.isoCode}
            value={`${country.isoCode}-${country.name}`}
          >
            {country.name}
          </option>
        ))}
        <option value={"other"}></option>
      </datalist>
      <div className={`flex ${selectedCountry == "other" ? "hidden" : ""}`}>
        <div className="flex flex-col mt-1">
          <label
            htmlFor="state"
            className=" text-base"
            style={{ color: "rgba(38, 32, 59, 1)" }}
          >
            State<span style={{ color: "rgba(228, 82, 112, 1)" }}> *</span>
          </label>
          <input
            list="states"
            id="state"
            name="state"
            className="border border-slate-400  w-[88%] mr-1 py-1.5 px-2 rounded-md "
            {...register("state")}
            onChange={handleStateChange}
            placeholder="Enter your state..."
            disabled={!countryName.length}
          />
          <datalist id="states">
            {states.map((state) => (
              <option
                key={state.isoCode}
                value={`${state.isoCode}-${state.name}`}
              >
                {/* {state.name} */}
              </option>
            ))}
            <option value={"other"}></option>
          </datalist>
        </div>

        <div className="flex flex-col mt-1">
          <label
            htmlFor="city"
            className=" text-base"
            style={{ color: "rgba(38, 32, 59, 1)" }}
          >
            City<span style={{ color: "rgba(228, 82, 112, 1)" }}> *</span>
          </label>
          <input
            list="cities"
            id="city"
            name="city"
            className="border border-slate-400  ml-1 py-1.5 px-2 rounded-md"
            {...register("city")}
            onChange={handleCityChange}
            placeholder="Enter your city..."
            disabled={!stateName.length}
          />
          <datalist id="cities">
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </datalist>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
