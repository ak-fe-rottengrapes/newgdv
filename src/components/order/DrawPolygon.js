'use client';
import { Button } from '@/components/ui/button'
import { PiPolygonDuotone } from "react-icons/pi";
import { useTool } from '@/app/context/ToolContext';
import { useContext, useState, useEffect, useRef } from 'react';
import { MapContext } from '@/app/context/MapContext';
import { Vector as VectorLayer } from 'ol/layer';
import { Draw, Modify, Snap } from 'ol/interaction';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { getArea } from 'ol/sphere';
import { useToast } from '@/hooks/use-toast';
import { GeoJSON } from 'ol/format';
import { unByKey } from 'ol/Observable.js';
import Overlay from 'ol/Overlay.js';

const DrawPolygon = () => {
    const { toast } = useToast();
    const { map } = useContext(MapContext);
    const { activeTool, setActiveTool, setOperaorGeoData, setLocation, setArea } = useTool();
    const isActive = activeTool === 'polygon';
    const [drawInteraction, setDrawInteraction] = useState(null);
    const [modifyInteraction, setModifyInteraction] = useState(null);
    const [snapInteraction, setSnapInteraction] = useState(null);
    const [vectorLayer, setVectorLayer] = useState(null);
    
    const helpTooltipElementRef = useRef(null);
    const helpTooltipRef = useRef(null);
    const measureTooltipElementRef = useRef(null);
    const measureTooltipRef = useRef(null);
    const sketchRef = useRef(null);
    const overlaysRef = useRef([]);

    const createMeasureTooltip = () => {
        if (measureTooltipElementRef.current) {
            measureTooltipElementRef.current.remove();
        }
        measureTooltipElementRef.current = document.createElement('div');
        measureTooltipElementRef.current.className = 'ol-tooltip ol-tooltip-measure';
        measureTooltipRef.current = new Overlay({
            element: measureTooltipElementRef.current,
            offset: [0, -15],
            positioning: 'bottom-center',
            stopEvent: false,
            insertFirst: false,
        });
        map.addOverlay(measureTooltipRef.current);
        overlaysRef.current.push(measureTooltipRef.current);
    };

    const createHelpTooltip = () => {
        if (helpTooltipElementRef.current) {
            helpTooltipElementRef.current.remove();
        }
        helpTooltipElementRef.current = document.createElement('div');
        helpTooltipElementRef.current.className = 'ol-tooltip hidden';
        helpTooltipRef.current = new Overlay({
            element: helpTooltipElementRef.current,
            offset: [15, 0],
            positioning: 'center-left',
        });
        map.addOverlay(helpTooltipRef.current);
        overlaysRef.current.push(helpTooltipRef.current);
    };

    const formatArea = (polygon) => {
        const area = getArea(polygon) / 1e6; // convert to km²
        return `${Math.round(area * 100) / 100} km²`;
    };

    const clearExisting = () => {
        overlaysRef.current.forEach(overlay => {
            if (overlay) {
                map.removeOverlay(overlay);
            }
        });
        overlaysRef.current = [];

        if (vectorLayer) {
            vectorLayer.getSource().clear();
        }

        if (measureTooltipElementRef.current) {
            measureTooltipElementRef.current.remove();
            measureTooltipElementRef.current = null;
        }
        if (helpTooltipElementRef.current) {
            helpTooltipElementRef.current.remove();
            helpTooltipElementRef.current = null;
        }
    };

    const updateMeasureTooltip = (geometry, position) => {
        const output = formatArea(geometry);
        if (measureTooltipElementRef.current) {
            measureTooltipElementRef.current.innerHTML = output;
            measureTooltipRef.current.setPosition(position);
        }
    };

    const handleDrawPolygonClick = () => {
        setActiveTool('polygon');
        
        const layers = map.getLayers().getArray();
        layers.forEach(layer => {
            if (layer instanceof VectorLayer) {
                map.removeLayer(layer);
            }
        });

        clearExisting();

        const source = new VectorSource();
        const newVectorLayer = new VectorLayer({
            source: source,
            style: (feature) => {
                const area = getArea(feature.getGeometry()) / 1e6;
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
                    })
                });
            },
        });
        setVectorLayer(newVectorLayer);
        map.addLayer(newVectorLayer);

        if (drawInteraction) map.removeInteraction(drawInteraction);
        if (modifyInteraction) map.removeInteraction(modifyInteraction);
        if (snapInteraction) map.removeInteraction(snapInteraction);

        createMeasureTooltip();
        createHelpTooltip();

        const draw = new Draw({
            source: source,
            type: 'Polygon',
        });

        let listener;
        draw.on('drawstart', (evt) => {
            clearExisting();
            createMeasureTooltip();
            createHelpTooltip();
            
            source.clear();
            sketchRef.current = evt.feature;
            let tooltipCoord = evt.coordinate;

            listener = sketchRef.current.getGeometry().on('change', (evt) => {
                const geom = evt.target;
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
                updateMeasureTooltip(geom, tooltipCoord);
            });
        });

        draw.on('drawend', (event) => {
            const feature = event.feature;
            const geom = feature.getGeometry();
            const area = getArea(geom) / 1e6;

            if (area < 20 || area > 10000) {
                source.removeFeature(feature);
                clearExisting();
                toast({
                    title: 'Invalid Polygon',
                    description: 'The area of the polygon must be between 20 km² and 10,000 km².',
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
                    coordinates: geom.clone().transform('EPSG:3857', 'EPSG:4326').getCoordinates()
                };
                setLocation(simplifiedData);
                setArea(parseFloat(area.toFixed(2)));

                // Keep the measure tooltip visible after drawing
                measureTooltipElementRef.current.className = 'ol-tooltip ol-tooltip-static';
                measureTooltipRef.current.setOffset([0, -7]);
                updateMeasureTooltip(geom, geom.getInteriorPoint().getCoordinates());
            }
            sketchRef.current = null;
            unByKey(listener);
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
        });

        // Add real-time measurement updates during modification
        modify.on('modifystart', (evt) => {
            sketchRef.current = evt.features.getArray()[0];
        });

        modify.on('modifying', (evt) => {
            if (sketchRef.current) {
                const geom = sketchRef.current.getGeometry();
                const tooltipCoord = geom.getInteriorPoint().getCoordinates();
                updateMeasureTooltip(geom, tooltipCoord);
            }
        });

        modify.on('modifyend', (event) => {
            const feature = event.features.getArray()[0];
            const geom = feature.getGeometry();
            const area = getArea(geom) / 1e6;

            if (area < 20 || area > 10000) {
                toast({
                    title: 'Invalid Polygon',
                    description: 'The area of the polygon must be between 20 km² and 10,000 km².',
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
                    coordinates: geom.clone().transform('EPSG:3857', 'EPSG:4326').getCoordinates()
                };
                setLocation(simplifiedData);
                setArea(parseFloat(area.toFixed(2)));

                // Update the measurement tooltip
                updateMeasureTooltip(geom, geom.getInteriorPoint().getCoordinates());
            }
        });

        const snap = new Snap({ source: source });

        map.addInteraction(draw);
        map.addInteraction(modify);
        map.addInteraction(snap);

        setDrawInteraction(draw);
        setModifyInteraction(modify);
        setSnapInteraction(snap);
    };

    useEffect(() => {
        return () => {
            // Do not clear existing overlays and features on unmount
        };
    }, []);

    return (
        <div>
            <Button
                className={`bg-[#2b3a4a] hover:bg-[#192028] hover:text-white
                    ${isActive ? 'bg-[#192028] text-white' : ''}
                    ${activeTool && !isActive ? 'cursor-not-allowed opacity-50' : ''}
                `}
                onClick={handleDrawPolygonClick}
                disabled={false}
            >
                <PiPolygonDuotone className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
            </Button>
        </div>
    );
};

export default DrawPolygon;