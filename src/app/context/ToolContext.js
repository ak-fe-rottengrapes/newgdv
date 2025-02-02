'use client';
import { createContext, useContext, useState } from 'react';

const ToolContext = createContext();

export function ToolProvider({ children }) {
  const [activeTool, setActiveTool] = useState(null);
  const [imagery_type, setImageryType] = useState('');
  const [resolution, setResolution] = useState(null);
  const [area, setArea] = useState(null);
  const [cloud_cover_percentage, setCloudCoverPercentage] = useState(10);
  const [date_from, setDateFrom] = useState('');
  const [date_to, setDateTo] = useState('');
  const [location, setLocation] = useState(null);
  const [operatorGeoData, setOperaorGeoData] = useState(null);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [ona_percentage, setOnaPercentage] = useState(10);
  const [operators, setOperators] = useState([]);
  const [order_type, setOrderType] = useState('');
  const [satellite_data, setSatelliteData] = useState(null);

  return (
    <ToolContext.Provider 
      value={{ 
        activeTool,
        setActiveTool,
        imagery_type,
        setImageryType,
        resolution,
        setResolution,
        area,
        setArea,
        cloud_cover_percentage,
        setCloudCoverPercentage,
        date_from,
        setDateFrom,
        date_to,
        setDateTo,
        location,
        setLocation,
        name,
        setName,
        note,
        setNote,
        ona_percentage,
        setOnaPercentage,
        operators,
        setOperators,
        order_type,
        setOrderType,
        satellite_data,
        setSatelliteData,
        operatorGeoData, 
        setOperaorGeoData
      }}
    >
      {children}
    </ToolContext.Provider>
  );
}

export const useTool = () => useContext(ToolContext); 