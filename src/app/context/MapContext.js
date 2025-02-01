"use client";

import { createContext, useState } from "react";

const defaultProvider = {
  map: null,
  baseMap: 'm',
  selectedMap: {
    image: '/images/standard_roadmap.png',
    name: 'Road'
  },
  setMap: () => {},
  handleMapChange: () => {},
};

export const MapContext = createContext(defaultProvider);

const MapProvider = ({ children }) => {
  const [map, setMap] = useState(defaultProvider.map);
  const [baseMap, setBaseMap] = useState(defaultProvider.baseMap);
  const [selectedMap, setSelectedMap] = useState(defaultProvider.selectedMap);

  const handleMapChange = (type, image, name) => {
    setBaseMap(type);
    setSelectedMap({ image, name });
  };

  const values = {
    map,
    setMap,
    baseMap,
    selectedMap,
    handleMapChange,
  };

  return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
};

export default MapProvider; 