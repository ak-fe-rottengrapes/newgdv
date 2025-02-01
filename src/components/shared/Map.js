'use client';
import { useEffect, useState, useContext } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import Image from 'next/image';
import { MdMyLocation } from "react-icons/md";
import { fromLonLat } from 'ol/proj';
import MapControls from './MapControls';
import { MapContext } from '@/app/context/MapContext';

const MapComponent = () => {
  const { map, setMap, baseMap, selectedMap, handleMapChange } = useContext(MapContext);
  const [expand, setExpand] = useState(false);
  
  useEffect(() => {
    const mapInstance = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new TileLayer({
          source: new XYZ({
            url: `http://mt0.google.com/vt/lyrs=${baseMap}&hl=en&x={x}&y={y}&z={z}&s=Ga`,
          })
        })
      ],
      view: new View({
        center: [8742511, 2409708],
        zoom: 5
      }),
      controls: []
    });

    setMap(mapInstance);

    return () => {
      mapInstance.setTarget(null);
    };
  }, [baseMap, setMap]);

  return (
    <div className="relative h-full w-full">
      <div id="map" className="w-full h-full absolute inset-0" />
      {map && <MapControls map={map} />}
      
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button 
          className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
          onClick={() => setExpand(!expand)}
        >
          <Image
            src={selectedMap.image}
            alt="current map style"
            width={56}
            height={56}
            className="w-14 h-14 rounded-md"
            title={selectedMap.name}
          />
        </button>

        {expand && (
          <div className="flex gap-2 animate-fadeIn">
            <button 
              className="bg-white  rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
              onClick={() => {
                setExpand(false);
                handleMapChange('m', '/assets/map/standard_roadmap.png', 'Road')
              }}
            >
              <Image
                src="/assets/map/standard_roadmap.png"
                alt="road map"
                width={56}
                height={56}
                className="w-14 h-14 rounded-md"
                title="Road"
              />
            </button>
            <button 
              className="bg-white  rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
              onClick={() => handleMapChange('s', '/assets/map/Terrain_Map.jpg', 'Terrain')}
            >
              <Image
                src="/assets/map/Terrain_Map.jpg"
                alt="satellite map"
                width={56}
                height={56}
                className="w-14 h-14 rounded-md"
                title="Terrain"
              />
            </button>
            <button 
              className="bg-white  rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
              onClick={() => handleMapChange('y', '/assets/map/hybrid.png', 'Hybrid')}
            >
              <Image
                src="/assets/map/hybrid.png"
                alt="hybrid map"
                width={56}
                height={56}
                className="w-14 h-14 rounded-md"
                title="Hybrid"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;