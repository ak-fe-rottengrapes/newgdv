"use client";

import { createContext, useContext, useState } from "react";




export const EmployeeContext = createContext();

export const useEmployeeContext = () => useContext(EmployeeContext)

const EmployeeProvider = ({ children }) => {
 
  const [map,setMap] = useState()
  const [geoJson, setGeoJson] = useState();
  
  const values = {
    map,setMap,
    geoJson, setGeoJson
  };


  return (
    <EmployeeContext.Provider value={values}>{children}</EmployeeContext.Provider>
  );
};

export default EmployeeProvider;
