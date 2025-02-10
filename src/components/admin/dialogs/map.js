import { useEffect, useRef, useContext, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { Style, Icon, Stroke, Fill } from "ol/style";
import { defaults } from "ol/control";
import { OSM, Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { GeoJSON } from "ol/format";
import { polygon } from "@turf/turf";
import { useAdmin } from "@/app/context/AdminContext";


const MapComponent = ({satelliteData}) => {
  const mapElement = useRef();
  const { map, setMap, geoJson, setGeoJson } = useAdmin()
  const [geoJsonLayer, setGeoJsonLayer] = useState(null);

  useEffect(()=>{
    if(!satelliteData) return
    console.log("satelliteData=>", satelliteData)
    const polygons = [];
        Object.keys(satelliteData).forEach(operator => {
            satelliteData[operator].forEach(data => {
                if(!data.imageGeo) return
                const vectorSource = new VectorSource({
                  features: new GeoJSON().readFeatures(data.imageGeo, {
                    featureProjection: map.getView().getProjection(),
                  }),
                });
        
                const defaultBorderColor = "#00FF00"; 
        
                const newGeoJsonLayer = new VectorLayer({
                  source: vectorSource,
                  style: (feature) => {
                    const borderColor = feature.get("borderColor") || defaultBorderColor; 
                    return new Style({
                      stroke: new Stroke({
                        color: borderColor, 
                        width: 2,
                      }),
                      fill: new Fill({
                        color: "rgba(255, 255, 255, 0.2)",
                      }),
                    });
                  },
                });
        
                map.addLayer(newGeoJsonLayer);
            });
        });

        // Style for polygon
        
    // map.addLayer(vectorLayer)
    // return ()=>{
    //   map?.removeLayer(vectorLayer)
    // }
  },[satelliteData,map])

  useEffect(() => {
    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      controls: defaults({ zoom: false }),
      view: new View({
        center: [0, 0],
        projection: "EPSG:4326",
        zoom: 3,
      }),
    });
    setMap(map);
    return () => map.setTarget(undefined); 
  }, []);

  useEffect(() => {
    if(!map || !geoJson) return 
    console.log("geoJson=>",geoJson)
    const addGeoJsonToMap = (geojson) => {
      if (map) {
        if (geoJsonLayer) {
          map.removeLayer(geoJsonLayer);
        }

        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(geojson, {
            featureProjection: map.getView().getProjection(),
          }),
        });

        const defaultBorderColor = "#00FF00"; 

        const newGeoJsonLayer = new VectorLayer({
          source: vectorSource,
          style: (feature) => {
            const borderColor = feature.get("borderColor") || defaultBorderColor; 
            return new Style({
              stroke: new Stroke({
                color: borderColor, 
                width: 2,
              }),
              fill: new Fill({
                color: "rgba(255, 255, 255, 0.2)",
              }),
            });
          },
        });

        map.addLayer(newGeoJsonLayer);
        setGeoJsonLayer(newGeoJsonLayer);

        // Center and zoom to the extent of the new features
        const extent = vectorSource.getExtent();
        map.getView().fit(extent, { padding: [20, 20, 20, 20] });
      }
    };
    addGeoJsonToMap(geoJson);
  }, [map, geoJson]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapElement} style={{ width: "100%", height: "100%" }} />

      <div style={{
        position: "absolute",
        top: "3px",
        right: "3px",
        backgroundColor: "white",
        padding: "8px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
      }} className="text-[9px]">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 mr-2 rounded-xl bg-red-600"></div>
          <p className="text-black">User Drawn Polygon</p>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 rounded-xl bg-green-600"></div>
          <p className="text-black">Operator&apos;s Polygon</p>
        </div>
      </div>
    </div>
  );
};


export default MapComponent;
