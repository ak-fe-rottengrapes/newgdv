
"use client";

import { createContext, useContext, useState } from "react";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
    const [orderId, setOrderId] = useState(null);
 
  const values = {
    orderId,
    setOrderId,
  };

  return <AdminContext.Provider value={values}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => useContext(AdminContext);
export default AdminProvider;