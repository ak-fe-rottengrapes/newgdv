
"use client";

import { createContext, useContext, useState } from "react";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
    const [orderId, setOrderId] = useState(null);
    const [map,setMap] = useState()
    const [geoJson, setGeoJson] = useState();
  const values = {
    orderId,
    setOrderId,
    geoJson,
    setGeoJson,
    map,
    setMap
  };

  return <AdminContext.Provider value={values}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => useContext(AdminContext);
export default AdminProvider;