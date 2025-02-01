'use client';
import { MdMyLocation } from "react-icons/md";
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Circle, Fill, Stroke } from 'ol/style';

const MapControls = ({ map }) => {
  const handleZoomIn = () => {
    map.getView().animate({ zoom: map.getView().getZoom() + 1 });
  };

  const handleZoomOut = () => {
    map.getView().animate({ zoom: map.getView().getZoom() - 1 });
  };

  const handleRelocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = fromLonLat([position.coords.longitude, position.coords.latitude]);
        
        const existingLayer = map.getLayers().getArray().find(layer => layer.get('name') === 'locationLayer');
        if (existingLayer) {
          map.removeLayer(existingLayer);
        }

        const marker = new Feature({
          geometry: new Point(coords)
        });

        const markerStyle = new Style({
          image: new Circle({
            radius: 12,
            fill: new Fill({
              color: '#2563eb'
            }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 3
            })
          }),
          zIndex: 1
        });

        const outerCircle = new Style({
          image: new Circle({
            radius: 35,
            fill: new Fill({
              color: 'rgba(37, 99, 235, 0.2)'
            }),
            stroke: new Stroke({
              color: 'rgba(37, 99, 235, 0.4)',
              width: 2
            })
          }),
          zIndex: 0
        });

        marker.setStyle([outerCircle, markerStyle]);

        const vectorLayer = new VectorLayer({
          name: 'locationLayer',
          source: new VectorSource({
            features: [marker]
          })
        });

        map.addLayer(vectorLayer);

        map.getView().animate({
          center: coords,
          zoom: 13
        });
      });
    }
  };

  return (
    <div className="absolute top-4 right-4">
      <div className="bg-[#212B35] rounded-lg shadow-lg flex flex-col">
        <button
          onClick={handleZoomIn}
          className="p-2 text-xl font-bold text-white hover:bg-[#2C3B48] transition-colors duration-200 border-b border-[#2C3B48] rounded-t-lg"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-xl font-bold text-white hover:bg-[#2C3B48] transition-colors duration-200 border-b border-[#2C3B48]"
        >
          −
        </button>
        <button
          onClick={handleRelocate}
          className="p-2 text-white hover:bg-[#2C3B48] transition-colors duration-200 rounded-b-lg"
        >
          <MdMyLocation className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default MapControls;