'use client';
import { Button } from '@/components/ui/button';
import { SquareDashed } from 'lucide-react';
import { useTool } from '@/app/context/ToolContext';
import { useContext, useState } from 'react';
import { MapContext } from '@/app/context/MapContext';
import { Vector as VectorLayer } from 'ol/layer';
import { Draw, Modify, Snap } from 'ol/interaction';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { getArea } from 'ol/sphere';
import { useToast } from '@/hooks/use-toast';
import { createBox } from 'ol/interaction/Draw';
import { fromExtent } from 'ol/geom/Polygon';
import { GeoJSON } from 'ol/format';

const Rectangle = () => {
    const { toast } = useToast();
    const { map } = useContext(MapContext);
    const { activeTool, setActiveTool, setOperaorGeoData, setLocation, setArea } = useTool();
    const isActive = activeTool === 'rectangle';
    const [drawInteraction, setDrawInteraction] = useState(null);
    const [modifyInteraction, setModifyInteraction] = useState(null);
    const [snapInteraction, setSnapInteraction] = useState(null);

    const handleDrawRectangleClick = () => {
        setActiveTool('rectangle');
        const layers = map.getLayers().getArray();
        layers.forEach(layer => {
            if (layer instanceof VectorLayer) {
                map.removeLayer(layer);
            }
        });

        const source = new VectorSource();
        const vectorLayer = new VectorLayer({
            source: source,
            style: (feature) => {
                const area = getArea(feature.getGeometry()) / 1e6; // convert to km²
                const isValid = area >= 20 && area <= 10000;
                return new Style({
                    fill: new Fill({
                        color: 'rgba(50, 150, 250, 0.3)',
                    }),
                    stroke: new Stroke({
                        color: isValid ? '#192028' : 'red',
                        width: 2,
                    }),
                    image: new CircleStyle({
                        radius: 5,
                        fill: new Fill({
                            color: '#ffcc33',
                        }),
                    }),
                    text: new Text({
                        font: '14px sans-serif',
                        offsetY: -15, // Move text above the rectangle
                        fill: new Fill({
                            color: '#ffffff',
                        }),
                        stroke: new Stroke({
                            color: '#000000',
                            width: 3,
                        }),
                        backgroundFill: new Fill({
                            color: 'rgba(0, 0, 0, 0.5)',
                        }),
                        backgroundStroke: new Stroke({
                            color: 'rgba(0, 0, 0, 0.5)',
                            width: 2,
                        }),
                        padding: [5, 8, 5, 8],
                        text: `Area: ${area.toFixed(2)} km²`,
                        borderRadius: 8 // Add rounded corners to the text background
                    }),
                });
            },
        });
        map.addLayer(vectorLayer);

        if (drawInteraction) {
            map.removeInteraction(drawInteraction);
        }
        if (modifyInteraction) {
            map.removeInteraction(modifyInteraction);
        }
        if (snapInteraction) {
            map.removeInteraction(snapInteraction);
        }

        const draw = new Draw({
            source: source,
            type: 'Circle',
            geometryFunction: createBox()
        });

        draw.on('drawstart', () => {
            source.clear(); // Remove existing polygons
        });
        
        const modify = new Modify({
            source: source,
            style: new Style({
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({
                        color: '#ffcc33',
                    }),
                }),
            }),
            condition: Modify.vertexOnly,
            geometryFunction: (coordinates, geometry) => {
                if (!geometry) {
                    geometry = fromExtent(coordinates);
                } else {
                    geometry.setCoordinates(fromExtent(coordinates).getCoordinates());
                }
                return geometry;
            }
        });

        modify.on('modifyend', (event) => {
            event.features.forEach((feature) => {
                const area = getArea(feature.getGeometry()) / 1e6; // convert to km²
                if (area < 20 || area > 10000) {
                    toast({
                        title: 'Invalid Rectangle',
                        description: 'The area of the rectangle must be between 20 km² and 10,000 km².',
                        status: 'error',
                        variant: "destructive",
                        duration: 1000,
                    });
                } else {
                    const geoData = {
                        type: "FeatureCollection",
                        features: [new GeoJSON().writeFeatureObject(feature, {
                            featureProjection: 'EPSG:3857',
                            dataProjection: 'EPSG:4326'
                        })]
                    };
                    setOperaorGeoData(geoData);

                    const simplifiedData = {
                        type: "Polygon",
                        coordinates: feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326').getCoordinates()
                    };
                    setLocation(simplifiedData);
                    setArea(parseFloat(area.toFixed(2)));
                }
            });
        });

        const snap = new Snap({ source: source });

        draw.on('drawend', (event) => {
            const feature = event.feature;
            const area = getArea(feature.getGeometry()) / 1e6; // convert to km²
            if (area < 20 || area > 10000) {
                source.removeFeature(feature);
                toast({
                    title: 'Invalid Rectangle',
                    description: 'The area of the rectangle must be between 20 km² and 10,000 km².',
                    status: 'error',
                    variant: "destructive",
                    duration: 1000,
                });
            } else {
                const geoData = {
                    type: "FeatureCollection",
                    features: [new GeoJSON().writeFeatureObject(feature, {
                        featureProjection: 'EPSG:3857',
                        dataProjection: 'EPSG:4326'
                    })]
                };
                setOperaorGeoData(geoData);

                const simplifiedData = {
                    type: "Polygon",
                    coordinates: feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326').getCoordinates()
                };
                setLocation(simplifiedData);
                setArea(parseFloat(area.toFixed(2)));
            }
        });

        map.addInteraction(draw);
        map.addInteraction(modify);
        map.addInteraction(snap);

        setDrawInteraction(draw);
        setModifyInteraction(modify);
        setSnapInteraction(snap);
    };

    return (
        <div>
            <Button
                className={`bg-[#2b3a4a] hover:bg-[#192028] hover:text-white
                    ${isActive ? 'bg-[#192028] text-white' : ''}
                    ${activeTool && !isActive ? 'cursor-not-allowed opacity-50' : ''}
                `}
                onClick={handleDrawRectangleClick}
                disabled={false}
            >
                <SquareDashed className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
            </Button>
        </div>
    );
};

export default Rectangle;