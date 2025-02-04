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
  const [hoverGeoJonData, setHoverGeoJsonData] = useState(defaultProvider.hoverGeoJonData);
  const [addToCartMap, setAddToCartMap] = useState(null);

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
    hoverGeoJonData, 
    setHoverGeoJsonData,
    addToCartMap, 
    setAddToCartMap
  };

  return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
};

export default MapProvider; 