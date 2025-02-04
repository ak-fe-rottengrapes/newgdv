import React, { useContext, useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { MapContext } from '@/app/context/MapContext';

const AddToCardMap = () => {
    const mapRef = useRef(null);

    const { addToCartMap,
        setAddToCartMap } = useContext(MapContext);

    useEffect(() => {
        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: [0, 0],
                zoom: 2,
            }),
        });

        setAddToCartMap(map);

        return () => {
            map.setTarget(null);
        };
    }, []);

    return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default AddToCardMap;
